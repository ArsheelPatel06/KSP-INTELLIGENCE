import type { BaseRepository, PaginatedRepositoryResult } from '@core/interfaces/repository.interface';
import type {
  VictimDetailRecord,
  VictimListItem,
  VictimListQuery,
  VictimRiskScoreItem,
} from '../types/victim.types';

export interface VictimRepository extends BaseRepository<VictimDetailRecord, bigint> {
  list(input: VictimListQuery): Promise<PaginatedRepositoryResult<VictimListItem>>;
  listByCaseId(caseMasterId: bigint, input?: Omit<VictimListQuery, 'caseMasterId'>): Promise<PaginatedRepositoryResult<VictimListItem>>;
  listRiskScores(victimId: bigint, limit?: number): Promise<VictimRiskScoreItem[]>;
}
