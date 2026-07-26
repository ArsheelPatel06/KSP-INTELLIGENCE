import type { AiTool, AiToolContract } from './tool.types';

export interface SearchActsToolInput {
  query?: string;
  actCode?: string;
  actName?: string;
  includeRepealed?: boolean;
  page?: number;
  pageSize?: number;
}

export interface ActSearchMatch {
  actId: string;
  actCode?: string;
  actName: string;
  jurisdiction?: string;
  effectiveFrom?: string;
  status?: string;
}

export interface SearchActsToolOutput {
  matches: ActSearchMatch[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export interface SearchActsToolContract extends AiToolContract<SearchActsToolInput, SearchActsToolOutput> {
  readonly name: 'searchActs';
  readonly category: 'legal';
}

export interface SearchActsTool extends AiTool<SearchActsToolInput, SearchActsToolOutput> {
  readonly contract: SearchActsToolContract;
}

export interface SearchIpcToolInput {
  query?: string;
  sectionCode?: string;
  keywords?: string[];
  actCode?: string;
  includeBns?: boolean;
  page?: number;
  pageSize?: number;
}

export interface IpcSearchMatch {
  sectionId: string;
  sectionCode: string;
  title: string;
  actCode?: string;
  punishment?: string;
  keywords?: string[];
  explanation?: string;
}

export interface SearchIpcToolOutput {
  matches: IpcSearchMatch[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export interface SearchIpcToolContract extends AiToolContract<SearchIpcToolInput, SearchIpcToolOutput> {
  readonly name: 'searchIPC';
  readonly category: 'legal';
}

export interface SearchIpcTool extends AiTool<SearchIpcToolInput, SearchIpcToolOutput> {
  readonly contract: SearchIpcToolContract;
}

export interface RecommendIpcToolInput {
  caseMasterId?: bigint;
  narrative: string;
  knownKeywords?: string[];
  preferredActs?: string[];
  topKSections?: number;
}

export interface RecommendedIpcSection {
  sectionId: string;
  sectionCode: string;
  actCode?: string;
  title: string;
  reason: string;
  matchedKeywords: string[];
  confidence: number;
}

export interface RecommendIpcToolOutput {
  recommendations: RecommendedIpcSection[];
  legalWarnings: string[];
}

export interface RecommendIpcToolContract extends AiToolContract<RecommendIpcToolInput, RecommendIpcToolOutput> {
  readonly name: 'recommendIPC';
  readonly category: 'legal';
}

export interface RecommendIpcTool extends AiTool<RecommendIpcToolInput, RecommendIpcToolOutput> {
  readonly contract: RecommendIpcToolContract;
}
