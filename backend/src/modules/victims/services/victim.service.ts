import { StatusCodes } from 'http-status-codes';
import type { ServiceResult } from '@core/interfaces/service.interface';
import { AppError } from '@core/exceptions/app-error';
import type { VictimRepository } from '../interfaces/victim-repository.interface';
import type {
  VictimDetailRecord,
  VictimListItem,
  VictimListQuery,
  VictimRiskScoreItem,
} from '../types/victim.types';

export class VictimService {
  constructor(private readonly repository: VictimRepository) {}

  async getVictimById(victimId: bigint): Promise<ServiceResult<VictimDetailRecord>> {
    const record = await this.repository.findById(victimId);
    return { data: this.ensureVictim(record, `Victim ${victimId} was not found`) };
  }

  async listVictims(input: VictimListQuery): Promise<ServiceResult<VictimListItem[]>> {
    const result = await this.repository.list(input);

    return {
      data: result.items,
      warnings: this.buildVictimWarnings(result.items),
      meta: result.meta,
    };
  }

  async listVictimsByCase(caseMasterId: bigint, input: Omit<VictimListQuery, 'caseMasterId'> = {}): Promise<ServiceResult<VictimListItem[]>> {
    const result = await this.repository.listByCaseId(caseMasterId, input);

    return {
      data: result.items,
      warnings: result.items.length === 0 ? ['No victims are linked to the selected case.'] : this.buildVictimWarnings(result.items),
      meta: {
        ...result.meta,
        caseMasterId: caseMasterId.toString(),
      },
    };
  }

  async getVictimRiskScores(victimId: bigint, limit = 10): Promise<ServiceResult<VictimRiskScoreItem[]>> {
    await this.assertVictimExists(victimId);
    const items = await this.repository.listRiskScores(victimId, limit);

    return {
      data: items,
      warnings: items.length === 0 ? ['No AI risk scores are available for the selected victim.'] : undefined,
      meta: {
        victimId: victimId.toString(),
        limit: Math.max(limit, 1),
        totalRecords: items.length,
      },
    };
  }

  private async assertVictimExists(victimId: bigint): Promise<void> {
    const record = await this.repository.findById(victimId);
    this.ensureVictim(record, `Victim ${victimId} was not found`);
  }

  private ensureVictim(record: VictimDetailRecord | null, message: string): VictimDetailRecord {
    if (!record) {
      throw new AppError(message, {
        statusCode: StatusCodes.NOT_FOUND,
        code: 'VICTIM_NOT_FOUND',
      });
    }

    return record;
  }

  private buildVictimWarnings(items: VictimListItem[]): string[] | undefined {
    const warnings = new Set<string>();

    for (const item of items) {
      if (!item.gender) {
        warnings.add('Some victims are missing gender classification.');
      }

      if (item.ageYear == null) {
        warnings.add('Some victims are missing age information.');
      }
    }

    return warnings.size > 0 ? [...warnings] : undefined;
  }
}
