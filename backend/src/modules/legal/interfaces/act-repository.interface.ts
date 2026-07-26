import type { PaginatedRepositoryResult } from '@core/interfaces/repository.interface';
import type {
  ActListQuery,
  ActRecord,
  CrimeHeadSectionMappingRecord,
  IpcReferenceListQuery,
  IpcReferenceRecord,
  LegalDocumentListQuery,
  LegalDocumentRecord,
  LegalSectionRecord,
  SectionListQuery,
} from '../types/legal.types';

export interface ActRepository {
  findActByCode(code: string): Promise<ActRecord | null>;
  listActs(input: ActListQuery): Promise<PaginatedRepositoryResult<ActRecord>>;
  findSection(actCode: string, sectionCode: string): Promise<LegalSectionRecord | null>;
  listSections(input: SectionListQuery): Promise<PaginatedRepositoryResult<LegalSectionRecord>>;
  listSectionsByCrimeHead(crimeHeadId: bigint): Promise<CrimeHeadSectionMappingRecord[]>;
  listLegalDocuments(input: LegalDocumentListQuery): Promise<PaginatedRepositoryResult<LegalDocumentRecord>>;
  listIpcReferences(input: IpcReferenceListQuery): Promise<PaginatedRepositoryResult<IpcReferenceRecord>>;
}
