import type {
  FindSimilarCasesToolInput,
  FindSimilarCasesToolOutput,
  GenerateSummaryToolInput,
  GenerateSummaryToolOutput,
  GenerateTimelineToolInput,
  GenerateTimelineToolOutput,
  SearchAccusedToolInput,
  SearchAccusedToolOutput,
  SearchCaseToolInput,
  SearchCaseToolOutput,
  SearchOfficerToolInput,
  SearchOfficerToolOutput,
  SearchVictimToolInput,
  SearchVictimToolOutput,
} from './investigation-tools.interface';
import type { RecommendIpcToolInput, RecommendIpcToolOutput, SearchActsToolInput, SearchActsToolOutput, SearchIpcToolInput, SearchIpcToolOutput } from './legal-tools.interface';
import type { SearchAnalyticsToolInput, SearchAnalyticsToolOutput, SearchGraphToolInput, SearchGraphToolOutput, SearchHotspotsToolInput, SearchHotspotsToolOutput, SearchRecommendationsToolInput, SearchRecommendationsToolOutput } from './intelligence-tools.interface';
import type { SpeechToTextToolInput, SpeechToTextToolOutput, TextToSpeechToolInput, TextToSpeechToolOutput, TranslateToolInput, TranslateToolOutput } from './communication-tools.interface';
import type { AiTool, AiToolExecutionContext, AiToolName } from './tool.types';
import type { AiExecutionResult } from '../shared/ai-result.types';

export interface AiToolRegistry {
  getTool<TInput, TOutput>(name: AiToolName): AiTool<TInput, TOutput> | undefined;

  searchCase(input: SearchCaseToolInput, context: AiToolExecutionContext): Promise<AiExecutionResult<SearchCaseToolOutput>>;
  searchVictim(input: SearchVictimToolInput, context: AiToolExecutionContext): Promise<AiExecutionResult<SearchVictimToolOutput>>;
  searchAccused(input: SearchAccusedToolInput, context: AiToolExecutionContext): Promise<AiExecutionResult<SearchAccusedToolOutput>>;
  searchOfficer(input: SearchOfficerToolInput, context: AiToolExecutionContext): Promise<AiExecutionResult<SearchOfficerToolOutput>>;

  searchActs(input: SearchActsToolInput, context: AiToolExecutionContext): Promise<AiExecutionResult<SearchActsToolOutput>>;
  searchIPC(input: SearchIpcToolInput, context: AiToolExecutionContext): Promise<AiExecutionResult<SearchIpcToolOutput>>;
  recommendIPC(input: RecommendIpcToolInput, context: AiToolExecutionContext): Promise<AiExecutionResult<RecommendIpcToolOutput>>;

  searchAnalytics(input: SearchAnalyticsToolInput, context: AiToolExecutionContext): Promise<AiExecutionResult<SearchAnalyticsToolOutput>>;
  searchGraph(input: SearchGraphToolInput, context: AiToolExecutionContext): Promise<AiExecutionResult<SearchGraphToolOutput>>;
  searchHotspots(input: SearchHotspotsToolInput, context: AiToolExecutionContext): Promise<AiExecutionResult<SearchHotspotsToolOutput>>;
  searchRecommendations(input: SearchRecommendationsToolInput, context: AiToolExecutionContext): Promise<AiExecutionResult<SearchRecommendationsToolOutput>>;

  findSimilarCases(input: FindSimilarCasesToolInput, context: AiToolExecutionContext): Promise<AiExecutionResult<FindSimilarCasesToolOutput>>;
  generateTimeline(input: GenerateTimelineToolInput, context: AiToolExecutionContext): Promise<AiExecutionResult<GenerateTimelineToolOutput>>;
  generateSummary(input: GenerateSummaryToolInput, context: AiToolExecutionContext): Promise<AiExecutionResult<GenerateSummaryToolOutput>>;

  translate(input: TranslateToolInput, context: AiToolExecutionContext): Promise<AiExecutionResult<TranslateToolOutput>>;
  speechToText(input: SpeechToTextToolInput, context: AiToolExecutionContext): Promise<AiExecutionResult<SpeechToTextToolOutput>>;
  textToSpeech(input: TextToSpeechToolInput, context: AiToolExecutionContext): Promise<AiExecutionResult<TextToSpeechToolOutput>>;
}
