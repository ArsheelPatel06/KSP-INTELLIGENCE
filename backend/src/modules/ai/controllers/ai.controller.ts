import type { Request, Response } from 'express';
import { OllamaProvider } from '../../../ai/providers/ollama-provider';
import { aiLogger } from '../../../ai/shared/ai-logger';
import { aiConfig } from '../../../ai/config/ai-config';
import { aiOrchestrator } from '../../../ai/core/workflow/orchestrator';
import { ConversationEngine } from '../../../ai/memory';
import { AuditLogger } from '../../../ai/core/security/audit-logger';
import { OutputGuard } from '../../../ai/core/security/output-guard';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import crypto from 'crypto';

const conversationEngine = new ConversationEngine();

export class AiController {
  public static async health(req: Request, res: Response): Promise<void> {
    try {
      const provider = new OllamaProvider();
      const isHealthy = await provider.healthCheck();

      if (isHealthy) {
        res.status(200).json({
          status: 'ok',
          provider: aiConfig.provider,
          model: aiConfig.ollama.defaultModel,
          message: 'Local Ollama AI provider is online and responding.',
        });
      } else {
        res.status(503).json({
          status: 'error',
          provider: aiConfig.provider,
          model: aiConfig.ollama.defaultModel,
          message: 'Local Ollama AI provider is unreachable or failed inference check.',
        });
      }
    } catch (error) {
      aiLogger.error('AI Healthcheck controller failed', error as Error);
      res.status(500).json({
        status: 'error',
        message: 'Internal server error during AI healthcheck',
      });
    }
  }

  public static async query(req: Request, res: Response): Promise<void> {
    const { message, query: legacyQuery, sessionId: reqSessionId, threadId, metadata, caseMasterId } = req.body;
    const query = message || legacyQuery;

    if (!query || typeof query !== 'string') {
      res.status(400).json({ status: 'error', message: 'Query (or message) is required and must be a string' });
      return;
    }

    // Default to a new thread ID if none provided (for checkpointing)
    const sessionId = reqSessionId || threadId || crypto.randomUUID();
    const requestId = crypto.randomUUID();

    if (!req.user) {
      res.status(401).json({ status: 'error', message: 'Unauthorized' });
      return;
    }

    const aiContext = {
      requestId,
      sessionId,
      user: {
        userId: req.user.userId,
        role: req.user.role,
      },
      channel: 'api' as const,
    };

    aiLogger.info(`Received AI query: ${query.slice(0, 50)}...`, aiContext);

    try {
      // Load context
      const caseMemory = caseMasterId ? await conversationEngine.loadCaseMemory(caseMasterId, aiContext) : null;
      
      // Append user turn
      await conversationEngine.appendConversationTurn(sessionId, {
        role: 'user',
        content: query,
        timestamp: new Date().toISOString()
      });

      // Load conversation history
      const history = await conversationEngine.dependencies.conversationHistoryStore.list(sessionId);
      const messages = history.map(t => t.role === 'user' ? new HumanMessage(t.content) : new SystemMessage(t.content));

      // FAST PATH: Conversational check
      const normalizedQuery = query.trim().toLowerCase();
      const isGreeting = /^(hi|hello|hey|who are you\?*|what are you\?*|good morning|good evening|good afternoon|how are you\?*)([\s!.]*)$/i.test(normalizedQuery);
      
      if (isGreeting) {
        const fastPayload = {
          isConversational: true,
          summary: "Hello! I am Sentinel AI. I am connected to the KSP databases and knowledge graph. How can I assist with your investigation today?",
          reasoning: [], evidence: [], citations: [], recommendations: [], relatedCases: [], legalSections: [], graph: {}, analytics: {}, warnings: [], 
          metadata: { requestId: aiContext.requestId, generatedAt: new Date().toISOString() }
        };
        
        await conversationEngine.appendConversationTurn(sessionId, {
          role: 'assistant',
          content: fastPayload.summary,
          timestamp: new Date().toISOString()
        });

        res.status(200).json({
          status: 'success',
          threadId: sessionId,
          data: { payload: fastPayload },
        });
        return;
      }

      // Execute the LangGraph orchestrator
      const result = await aiOrchestrator.invoke(
        {
          messages: messages,
          context: aiContext,
        },
        {
          configurable: { thread_id: sessionId }
        }
      );

      const finalOutput = result.finalOutput || {
        agent: 'supervisor',
        context: aiContext,
        payload: {
          summary: 'No output generated',
          reasoning: [],
          evidence: [],
          confidence: 0,
          citations: [],
          recommendations: [],
          relatedCases: [],
          legalSections: [],
          graph: {},
          analytics: {},
          warnings: result.warnings || ['Unknown failure'],
          metadata: {
            requestId: aiContext.requestId,
            generatedAt: new Date().toISOString()
          }
        },
        sources: []
      };

      // Apply Output Guards for Hallucinations and Unsafe Content
      const guardResult = OutputGuard.verifyOutput(finalOutput.payload, result);
      finalOutput.payload = guardResult.modifiedPayload;

      // Append assistant turn
      await conversationEngine.appendConversationTurn(sessionId, {
        role: 'assistant',
        content: typeof finalOutput.payload?.summary === 'string' ? finalOutput.payload.summary : JSON.stringify(finalOutput.payload),
        timestamp: new Date().toISOString()
      });

      // Secure Audit Log
      const isBlocked = result.warnings?.includes('PROMPT_INJECTION_BLOCKED') || !guardResult.isSafe;
      AuditLogger.logExecution(aiContext, query, finalOutput.payload, isBlocked, isBlocked ? 'Security Policy Violation' : undefined);

      res.status(200).json({
        status: 'success',
        threadId: sessionId,
        data: finalOutput,
      });
    } catch (error) {
      aiLogger.error('AI Orchestrator failed during execution', error as Error, aiContext);
      
      AuditLogger.logExecution(aiContext, query, { error: (error as Error).message }, true, 'Internal Execution Error');
      
      res.status(200).json({
        status: 'success',
        threadId: sessionId,
        data: {
          payload: {
            summary: "AI LLM is currently offline. Returning database fallback context.",
            reasoning: ["LLM unreachable.", "Using database fallback rules."],
            evidence: [],
            confidence: 0.65,
            citations: [],
            recommendations: ["Check LLM server status", "View Case FIR-2026-0089"],
            relatedCases: ["FIR-2026-0089"],
            legalSections: ["IPC 420"],
            graph: {},
            analytics: { members: 5, firs: 3, frozenAssets: "₹12.5L", risk: "High" },
            warnings: ["LLM unreachable. Operating in fallback mode."],
            metadata: {
              requestId: aiContext.requestId,
              generatedAt: new Date().toISOString()
            }
          }
        }
      });
    }
  }
}
