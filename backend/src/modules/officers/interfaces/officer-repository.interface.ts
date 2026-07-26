import type { BaseRepository, PaginatedRepositoryResult } from '@core/interfaces/repository.interface';
import type {
  OfficerAssignedCaseItem,
  OfficerDetailRecord,
  OfficerListItem,
  OfficerListQuery,
} from '../types/officer.types';

export interface OfficerRepository extends BaseRepository<OfficerDetailRecord, bigint> {
  findByKgid(kgid: string): Promise<OfficerDetailRecord | null>;
  list(input: OfficerListQuery): Promise<PaginatedRepositoryResult<OfficerListItem>>;
  listAssignedCases(employeeId: bigint, input?: Pick<OfficerListQuery, 'page' | 'pageSize'>): Promise<PaginatedRepositoryResult<OfficerAssignedCaseItem>>;
}
