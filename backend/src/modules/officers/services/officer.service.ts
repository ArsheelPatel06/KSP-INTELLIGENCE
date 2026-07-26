import { StatusCodes } from 'http-status-codes';
import type { ServiceResult } from '@core/interfaces/service.interface';
import { AppError } from '@core/exceptions/app-error';
import type { OfficerRepository } from '../interfaces/officer-repository.interface';
import type {
  OfficerAssignedCaseItem,
  OfficerDetailRecord,
  OfficerListItem,
  OfficerListQuery,
} from '../types/officer.types';

export class OfficerService {
  constructor(private readonly repository: OfficerRepository) {}

  async getOfficerById(employeeId: bigint): Promise<ServiceResult<OfficerDetailRecord>> {
    const record = await this.repository.findById(employeeId);
    return { data: this.ensureOfficer(record, `Officer ${employeeId} was not found`) };
  }

  async getOfficerByKgid(kgid: string): Promise<ServiceResult<OfficerDetailRecord>> {
    const normalizedKgid = kgid.trim();
    const record = await this.repository.findByKgid(normalizedKgid);

    return { data: this.ensureOfficer(record, `Officer with KGID ${normalizedKgid} was not found`) };
  }

  async listOfficers(input: OfficerListQuery): Promise<ServiceResult<OfficerListItem[]>> {
    const result = await this.repository.list(input);

    return {
      data: result.items,
      warnings: this.buildOfficerWarnings(result.items),
      meta: result.meta,
    };
  }

  async getAssignedCases(employeeId: bigint, input: Pick<OfficerListQuery, 'page' | 'pageSize'> = {}): Promise<ServiceResult<OfficerAssignedCaseItem[]>> {
    await this.assertOfficerExists(employeeId);
    const result = await this.repository.listAssignedCases(employeeId, input);

    return {
      data: result.items,
      warnings: result.items.length === 0 ? ['No cases are currently assigned to the selected officer.'] : undefined,
      meta: {
        ...result.meta,
        employeeId: employeeId.toString(),
      },
    };
  }

  private async assertOfficerExists(employeeId: bigint): Promise<void> {
    const record = await this.repository.findById(employeeId);
    this.ensureOfficer(record, `Officer ${employeeId} was not found`);
  }

  private ensureOfficer(record: OfficerDetailRecord | null, message: string): OfficerDetailRecord {
    if (!record) {
      throw new AppError(message, {
        statusCode: StatusCodes.NOT_FOUND,
        code: 'OFFICER_NOT_FOUND',
      });
    }

    return record;
  }

  private buildOfficerWarnings(items: OfficerListItem[]): string[] | undefined {
    const warnings = new Set<string>();

    for (const item of items) {
      if (!item.rank) {
        warnings.add('Some officers are missing rank mapping.');
      }

      if (!item.unit) {
        warnings.add('Some officers are not linked to a police unit.');
      }

      if (!item.active) {
        warnings.add('The result set includes inactive officer records.');
      }
    }

    return warnings.size > 0 ? [...warnings] : undefined;
  }
}
