import type { AiTool, AiToolContract } from './tool.types';

export interface SearchCaseToolInput {
  query?: string;
  caseMasterId?: bigint;
  crimeNo?: string;
  districtId?: number;
  unitId?: number;
  policeStationId?: number;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  pageSize?: number;
}

export interface CaseSearchMatch {
  caseMasterId: bigint;
  crimeNo: string;
  districtName?: string;
  policeStationName?: string;
  caseStatus?: string;
  registeredAt?: string;
  primaryActs?: string[];
  primarySections?: string[];
  summary?: string;
}

export interface SearchCaseToolOutput {
  matches: CaseSearchMatch[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export interface SearchCaseToolContract extends AiToolContract<SearchCaseToolInput, SearchCaseToolOutput> {
  readonly name: 'searchCase';
  readonly category: 'investigation';
}

export interface SearchCaseTool extends AiTool<SearchCaseToolInput, SearchCaseToolOutput> {
  readonly contract: SearchCaseToolContract;
}

export interface SearchVictimToolInput {
  caseMasterId?: bigint;
  victimName?: string;
  gender?: string;
  minAge?: number;
  maxAge?: number;
  districtId?: number;
  page?: number;
  pageSize?: number;
}

export interface VictimSearchMatch {
  victimId: bigint;
  caseMasterId?: bigint;
  victimName?: string;
  age?: number;
  gender?: string;
  occupation?: string;
  districtName?: string;
  summary?: string;
}

export interface SearchVictimToolOutput {
  matches: VictimSearchMatch[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export interface SearchVictimToolContract extends AiToolContract<SearchVictimToolInput, SearchVictimToolOutput> {
  readonly name: 'searchVictim';
  readonly category: 'investigation';
}

export interface SearchVictimTool extends AiTool<SearchVictimToolInput, SearchVictimToolOutput> {
  readonly contract: SearchVictimToolContract;
}

export interface SearchAccusedToolInput {
  caseMasterId?: bigint;
  accusedName?: string;
  alias?: string;
  phoneNumber?: string;
  districtId?: number;
  page?: number;
  pageSize?: number;
}

export interface AccusedSearchMatch {
  accusedId: bigint;
  caseMasterId?: bigint;
  accusedName?: string;
  aliasNames?: string[];
  districtName?: string;
  previousCaseCount?: number;
  riskScore?: number;
  summary?: string;
}

export interface SearchAccusedToolOutput {
  matches: AccusedSearchMatch[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export interface SearchAccusedToolContract extends AiToolContract<SearchAccusedToolInput, SearchAccusedToolOutput> {
  readonly name: 'searchAccused';
  readonly category: 'investigation';
}

export interface SearchAccusedTool extends AiTool<SearchAccusedToolInput, SearchAccusedToolOutput> {
  readonly contract: SearchAccusedToolContract;
}

export interface SearchOfficerToolInput {
  employeeId?: bigint;
  officerName?: string;
  roleCode?: string;
  districtId?: number;
  unitId?: number;
  page?: number;
  pageSize?: number;
}

export interface OfficerSearchMatch {
  employeeId: bigint;
  officerName: string;
  roleCode?: string;
  designation?: string;
  districtName?: string;
  unitName?: string;
}

export interface SearchOfficerToolOutput {
  matches: OfficerSearchMatch[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export interface SearchOfficerToolContract extends AiToolContract<SearchOfficerToolInput, SearchOfficerToolOutput> {
  readonly name: 'searchOfficer';
  readonly category: 'investigation';
}

export interface SearchOfficerTool extends AiTool<SearchOfficerToolInput, SearchOfficerToolOutput> {
  readonly contract: SearchOfficerToolContract;
}

export interface FindSimilarCasesToolInput {
  caseMasterId?: bigint;
  narrative?: string;
  districtId?: number;
  topK?: number;
  minimumSimilarity?: number;
}

export interface SimilarCaseMatch {
  caseMasterId: bigint;
  crimeNo: string;
  similarityScore: number;
  similarityReasons: string[];
  summary?: string;
}

export interface FindSimilarCasesToolOutput {
  anchorCaseMasterId?: bigint;
  matches: SimilarCaseMatch[];
}

export interface FindSimilarCasesToolContract extends AiToolContract<FindSimilarCasesToolInput, FindSimilarCasesToolOutput> {
  readonly name: 'findSimilarCases';
  readonly category: 'investigation';
}

export interface FindSimilarCasesTool extends AiTool<FindSimilarCasesToolInput, FindSimilarCasesToolOutput> {
  readonly contract: FindSimilarCasesToolContract;
}

export interface GenerateTimelineToolInput {
  caseMasterId: bigint;
  includeCourtEvents?: boolean;
  includeAiEvents?: boolean;
  includeEvidenceEvents?: boolean;
}

export interface TimelineEvent {
  timestamp: string;
  eventType: string;
  title: string;
  description?: string;
  actorName?: string;
  sourceType?: string;
  sourceId?: string;
}

export interface GenerateTimelineToolOutput {
  caseMasterId: bigint;
  events: TimelineEvent[];
  generatedAt: string;
}

export interface GenerateTimelineToolContract extends AiToolContract<GenerateTimelineToolInput, GenerateTimelineToolOutput> {
  readonly name: 'generateTimeline';
  readonly category: 'investigation';
}

export interface GenerateTimelineTool extends AiTool<GenerateTimelineToolInput, GenerateTimelineToolOutput> {
  readonly contract: GenerateTimelineToolContract;
}

export interface GenerateSummaryToolInput {
  entityType: 'CASE' | 'VICTIM' | 'ACCUSED' | 'OFFICER';
  entityId: string;
  summaryType: 'brief' | 'investigation' | 'supervisor';
  language?: string;
}

export interface GenerateSummaryToolOutput {
  entityType: 'CASE' | 'VICTIM' | 'ACCUSED' | 'OFFICER';
  entityId: string;
  title: string;
  summary: string;
  highlights: string[];
}

export interface GenerateSummaryToolContract extends AiToolContract<GenerateSummaryToolInput, GenerateSummaryToolOutput> {
  readonly name: 'generateSummary';
  readonly category: 'investigation';
}

export interface GenerateSummaryTool extends AiTool<GenerateSummaryToolInput, GenerateSummaryToolOutput> {
  readonly contract: GenerateSummaryToolContract;
}
