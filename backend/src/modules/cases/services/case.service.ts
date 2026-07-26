import { StatusCodes } from 'http-status-codes';
import type { ServiceResult } from '@core/interfaces/service.interface';
import { AppError } from '@core/exceptions/app-error';
import type { CaseRepository } from '../interfaces/case-repository.interface';
import type { CaseDetailRecord, CaseListItem, CaseListQuery, CaseSimilarityItem } from '../types/case.types';

export class CaseService {
  constructor(private readonly repository: CaseRepository) {}

  async getCaseById(caseMasterId: bigint): Promise<ServiceResult<CaseDetailRecord>> {
    const record = await this.repository.findById(caseMasterId);
    return { data: this.ensureCase(record, `Case ${caseMasterId} was not found`) };
  }

  async getCaseByCrimeNo(crimeNo: string): Promise<ServiceResult<CaseDetailRecord>> {
    const normalizedCrimeNo = crimeNo.trim();
    const record = await this.repository.findByCrimeNo(normalizedCrimeNo);

    return { data: this.ensureCase(record, `Case with crime number ${normalizedCrimeNo} was not found`) };
  }

  async getCaseByCaseNo(caseNo: string): Promise<ServiceResult<CaseDetailRecord>> {
    const normalizedCaseNo = caseNo.trim();
    const record = await this.repository.findByCaseNo(normalizedCaseNo);

    return { data: this.ensureCase(record, `Case with case number ${normalizedCaseNo} was not found`) };
  }

  async listCases(input: CaseListQuery): Promise<ServiceResult<CaseListItem[]>> {
    const result = await this.repository.list(input);
    const warnings = this.buildCaseWarnings(result.items);

    return {
      data: result.items,
      warnings,
      meta: result.meta,
    };
  }

  async getSimilarCases(caseMasterId: bigint, limit = 10): Promise<ServiceResult<CaseSimilarityItem[]>> {
    await this.assertCaseExists(caseMasterId);
    const items = await this.repository.listSimilarCases(caseMasterId, limit);
    const warnings = items.length === 0 ? ['No similar cases were found for the selected case.'] : undefined;

    return {
      data: items,
      warnings,
      meta: {
        caseMasterId: caseMasterId.toString(),
        limit: Math.max(limit, 1),
        totalMatches: items.length,
      },
    };
  }

  private async assertCaseExists(caseMasterId: bigint): Promise<void> {
    const record = await this.repository.findById(caseMasterId);
    this.ensureCase(record, `Case ${caseMasterId} was not found`);
  }

  private ensureCase(record: CaseDetailRecord | null, message: string): CaseDetailRecord {
    if (!record) {
      throw new AppError(message, {
        statusCode: StatusCodes.NOT_FOUND,
        code: 'CASE_NOT_FOUND',
      });
    }

    return record;
  }

  private buildCaseWarnings(items: CaseListItem[]): string[] | undefined {
    const warnings = new Set<string>();

    for (const item of items) {
      if (!item.briefFacts) {
        warnings.add('Some cases are missing brief facts, which may affect similarity and legal recommendation quality.');
      }

      if (!item.policeStation) {
        warnings.add('Some cases are not linked to a police station.');
      }

      if (!item.status) {
        warnings.add('Some cases are missing case status.');
      }
    }

    return warnings.size > 0 ? [...warnings] : undefined;
  }
}
