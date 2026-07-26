import type { BaseRepository, PaginatedRepositoryResult } from '@core/interfaces/repository.interface';
import type { CaseDetailRecord, CaseListItem, CaseListQuery, CaseSimilarityItem } from '../types/case.types';

export interface CaseRepository extends BaseRepository<CaseDetailRecord, bigint> {
  findByCrimeNo(crimeNo: string): Promise<CaseDetailRecord | null>;
  findByCaseNo(caseNo: string): Promise<CaseDetailRecord | null>;
  list(input: CaseListQuery): Promise<PaginatedRepositoryResult<CaseListItem>>;
  listSimilarCases(caseMasterId: bigint, limit?: number): Promise<CaseSimilarityItem[]>;
}
