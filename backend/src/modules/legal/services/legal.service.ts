import { StatusCodes } from 'http-status-codes';
import type { ServiceResult } from '@core/interfaces/service.interface';
import { AppError } from '@core/exceptions/app-error';
import type { ActRepository } from '../interfaces/act-repository.interface';
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

export class LegalService {
  constructor(private readonly repository: ActRepository) {}

  async getActByCode(code: string): Promise<ServiceResult<ActRecord>> {
    const normalizedCode = code.trim();
    const record = await this.repository.findActByCode(normalizedCode);

    if (!record) {
      throw new AppError(`Act ${normalizedCode} was not found`, {
        statusCode: StatusCodes.NOT_FOUND,
        code: 'ACT_NOT_FOUND',
      });
    }

    return { data: record };
  }

  async listActs(input: ActListQuery): Promise<ServiceResult<ActRecord[]>> {
    const result = await this.repository.listActs(input);

    return {
      data: result.items,
      warnings: result.items.length === 0 ? ['No acts matched the current search filters.'] : undefined,
      meta: result.meta,
    };
  }

  async getSection(actCode: string, sectionCode: string): Promise<ServiceResult<LegalSectionRecord>> {
    const normalizedActCode = actCode.trim();
    const normalizedSectionCode = sectionCode.trim();
    const record = await this.repository.findSection(normalizedActCode, normalizedSectionCode);

    if (!record) {
      throw new AppError(`Section ${normalizedActCode}/${normalizedSectionCode} was not found`, {
        statusCode: StatusCodes.NOT_FOUND,
        code: 'SECTION_NOT_FOUND',
      });
    }

    const warnings = this.buildSectionWarnings(record);
    return { data: record, warnings };
  }

  async listSections(input: SectionListQuery): Promise<ServiceResult<LegalSectionRecord[]>> {
    const result = await this.repository.listSections(input);
    const warnings = result.items.some((item) => !item.description)
      ? ['Some sections are missing descriptive text.']
      : undefined;

    return {
      data: result.items,
      warnings,
      meta: result.meta,
    };
  }

  async listSectionsByCrimeHead(crimeHeadId: bigint): Promise<ServiceResult<CrimeHeadSectionMappingRecord[]>> {
    const items = await this.repository.listSectionsByCrimeHead(crimeHeadId);

    return {
      data: items,
      warnings: items.length === 0 ? ['No legal section mappings are available for the selected crime head.'] : undefined,
      meta: {
        crimeHeadId: crimeHeadId.toString(),
        totalRecords: items.length,
      },
    };
  }

  async listLegalDocuments(input: LegalDocumentListQuery): Promise<ServiceResult<LegalDocumentRecord[]>> {
    const result = await this.repository.listLegalDocuments(input);

    return {
      data: result.items,
      warnings: result.items.some((item) => !item.sourceUrl)
        ? ['Some legal documents do not have a source URL reference.']
        : undefined,
      meta: result.meta,
    };
  }

  async listIpcReferences(input: IpcReferenceListQuery): Promise<ServiceResult<IpcReferenceRecord[]>> {
    const result = await this.repository.listIpcReferences(input);
    const warnings = new Set<string>();

    if (result.items.some((item) => !item.descriptionText)) {
      warnings.add('Some IPC references are missing description text.');
    }

    if (result.items.some((item) => !item.punishmentText)) {
      warnings.add('Some IPC references are missing punishment details.');
    }

    return {
      data: result.items,
      warnings: warnings.size > 0 ? [...warnings] : undefined,
      meta: result.meta,
    };
  }

  private buildSectionWarnings(record: LegalSectionRecord): string[] | undefined {
    const warnings = new Set<string>();

    if (!record.description) {
      warnings.add('This section does not have a normalized description yet.');
    }

    if (record.ipcReferences.length === 0) {
      warnings.add('No IPC reference rows are linked to this section.');
    }

    return warnings.size > 0 ? [...warnings] : undefined;
  }
}
