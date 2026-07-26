import { StatusCodes } from 'http-status-codes';
import type { ServiceResult } from '@core/interfaces/service.interface';
import { AppError } from '@core/exceptions/app-error';
import type { CaseService } from '@modules/cases/services/case.service';
import type { GraphService } from '@modules/graph/services/graph.service';
import type { RecommendationService } from '@modules/recommendations/services/recommendation.service';
import type { ChatRepository } from '../interfaces/chat-repository.interface';
import type {
  ChatSessionDetailRecord,
  ChatSessionListItem,
  ChatSessionListQuery,
  CreateChatSessionInput,
  SendChatMessageInput,
  StructuredChatAnswer,
} from '../types/chat.types';

export interface SendChatMessageResult {
  userMessageId: string;
  assistantMessageId: string;
  answer: StructuredChatAnswer;
  linkedRecommendationIds: string[];
}

export class ChatService {
  constructor(
    private readonly repository: ChatRepository,
    private readonly caseService: CaseService,
    private readonly recommendationService: RecommendationService,
    private readonly graphService: GraphService,
  ) {}

  async createSession(input: CreateChatSessionInput): Promise<ServiceResult<ChatSessionDetailRecord>> {
    const session = await this.repository.createSession(input);
    return { data: session };
  }

  async listSessions(input: ChatSessionListQuery): Promise<ServiceResult<ChatSessionListItem[]>> {
    const result = await this.repository.listSessions(input);
    return {
      data: result.items,
      warnings: result.items.length === 0 ? ['No chat sessions matched the selected filters.'] : undefined,
      meta: result.meta,
    };
  }

  async getSessionMessages(chatSessionId: bigint): Promise<ServiceResult<ChatSessionDetailRecord>> {
    const session = await this.repository.findSessionById(chatSessionId);
    if (!session) {
      throw new AppError(`Chat session ${chatSessionId} was not found`, {
        statusCode: StatusCodes.NOT_FOUND,
        code: 'CHAT_SESSION_NOT_FOUND',
      });
    }

    return {
      data: session,
      warnings: session.messages.length === 0 ? ['This chat session has no messages yet.'] : undefined,
    };
  }

  async sendMessage(chatSessionId: bigint, input: SendChatMessageInput): Promise<ServiceResult<SendChatMessageResult>> {
    const session = await this.repository.findSessionById(chatSessionId);
    if (!session) {
      throw new AppError(`Chat session ${chatSessionId} was not found`, {
        statusCode: StatusCodes.NOT_FOUND,
        code: 'CHAT_SESSION_NOT_FOUND',
      });
    }

    const userMessage = await this.repository.createMessage({
      chatSessionId,
      senderRole: 'user',
      messageText: input.messageText,
    });

    const answer = await this.composeAnswer(session, input);
    const linkedRecommendationIds = await this.collectRecommendationIds(session.caseMasterId);

    const assistantMessage = await this.repository.createMessage({
      chatSessionId,
      senderRole: 'assistant',
      messageText: answer.summary,
      linkedRecommendationId: linkedRecommendationIds[0] ? BigInt(linkedRecommendationIds[0]) : undefined,
    });

    return {
      data: {
        userMessageId: userMessage.id.toString(),
        assistantMessageId: assistantMessage.id.toString(),
        answer,
        linkedRecommendationIds,
      },
      warnings: linkedRecommendationIds.length === 0 ? ['No linked recommendations were available for this response.'] : undefined,
    };
  }

  private async composeAnswer(session: ChatSessionDetailRecord, input: SendChatMessageInput): Promise<StructuredChatAnswer> {
    const evidence: string[] = [];
    const connections: string[] = [];
    const insights: string[] = [];
    const suggestedLeads: string[] = [];

    if (!session.caseMasterId) {
      return {
        summary: 'This session is not linked to a case yet. Create or attach a case to unlock investigation context.',
        evidence,
        connections,
        insights,
        suggestedLeads: ['Attach a case to this session.', 'Provide a more specific investigation question.'],
        confidence: {
          label: 'Low',
          score: 0.2,
          reason: 'No linked case context is available.',
        },
        nextAction: 'Associate the session with a case and retry the query.',
      };
    }

    const [caseResult, recommendationResult] = await Promise.all([
      this.caseService.getCaseById(session.caseMasterId),
      this.recommendationService.getCaseRecommendations(session.caseMasterId, 3),
    ]);

    const caseRecord = caseResult.data;
    evidence.push(`Case ${caseRecord.caseNo ?? caseRecord.crimeNo ?? caseRecord.id.toString()}`);
    if (caseRecord.status?.name) evidence.push(`Status: ${caseRecord.status.name}`);
    if (caseRecord.majorCrimeHead?.groupName) evidence.push(`Crime head: ${caseRecord.majorCrimeHead.groupName}`);
    if (caseRecord.policeStation?.name) evidence.push(`Police station: ${caseRecord.policeStation.name}`);

    if (!caseRecord.briefFacts) {
      insights.push('Case narrative is missing or incomplete, which reduces recommendation precision.');
    } else {
      insights.push(`Case narrative available with ${caseRecord.briefFacts.length} characters of brief facts.`);
    }

    if (recommendationResult.data.length > 0) {
      for (const recommendation of recommendationResult.data.slice(0, 3)) {
        suggestedLeads.push(recommendation.recommendationText);
      }
    } else {
      suggestedLeads.push('Review the case narrative and legal sections for missing evidence or escalation opportunities.');
    }

    if (input.includeGraph) {
      try {
        const graphResult = await this.graphService.getCaseGraph(session.caseMasterId, { depth: 1 });
        const nodeCount = Array.isArray(graphResult.data.nodes) ? graphResult.data.nodes.length : 0;
        const edgeCount = Array.isArray(graphResult.data.edges) ? graphResult.data.edges.length : 0;
        connections.push(`Graph context found ${nodeCount} nodes and ${edgeCount} edges around the case.`);
      } catch {
        connections.push('Graph context is not yet available for this case.');
      }
    }

    const summary = this.buildSummary(caseRecord.briefFacts, input.messageText, suggestedLeads);
    const score = this.computeConfidence(caseRecord, recommendationResult.data.length, input.includeGraph === true && connections.length > 0);

    return {
      summary,
      evidence,
      connections,
      insights,
      suggestedLeads,
      confidence: {
        label: score >= 0.8 ? 'High' : score >= 0.5 ? 'Medium' : 'Low',
        score,
        reason: score >= 0.8
          ? 'Case facts, status, and recommendations are available.'
          : score >= 0.5
            ? 'Partial case context is available, but some investigation signals are incomplete.'
            : 'Key case details are missing or sparse.',
      },
      nextAction: suggestedLeads[0] ?? 'Review the linked case details manually.',
    };
  }

  private buildSummary(briefFacts: string | null, question: string, suggestedLeads: string[]): string {
    if (question.toLowerCase().includes('similar')) {
      return suggestedLeads[0]
        ? `Similar-case support is available. Start with: ${suggestedLeads[0]}`
        : 'Similar-case support needs richer narrative and recommendation context.';
    }

    return briefFacts?.slice(0, 240) ?? 'Investigation context is available, but the case narrative is limited.';
  }

  private computeConfidence(caseRecord: ChatSessionDetailRecord['case'], recommendationCount: number, hasGraph: boolean): number {
    let score = 0.35;
    if (caseRecord?.briefFacts) score += 0.25;
    if (caseRecord?.crimeNo || caseRecord?.caseNo) score += 0.1;
    if (recommendationCount > 0) score += 0.2;
    if (hasGraph) score += 0.1;
    return Math.min(score, 0.95);
  }

  private async collectRecommendationIds(caseMasterId: bigint | null): Promise<string[]> {
    if (!caseMasterId) return [];
    const result = await this.recommendationService.getCaseRecommendations(caseMasterId, 5);
    return result.data.map((item) => item.id.toString());
  }
}
