import type { ServiceResult } from '@core/interfaces/service.interface';
import type { AnalyticsRepository } from '@modules/analytics/interfaces/analytics-repository.interface';
import type { CaseRepository } from '@modules/cases/interfaces/case-repository.interface';
import type { OfficerRepository } from '@modules/officers/interfaces/officer-repository.interface';
import type { VictimRepository } from '@modules/victims/interfaces/victim-repository.interface';
import type { DashboardOverview, DashboardSummaryCard, OfficerDashboard } from '../types/dashboard.types';

export class DashboardService {
  constructor(
    private readonly caseRepository: CaseRepository,
    private readonly victimRepository: VictimRepository,
    private readonly officerRepository: OfficerRepository,
    private readonly analyticsRepository: AnalyticsRepository,
  ) {}

  async getOverview(): Promise<ServiceResult<DashboardOverview>> {
    const [recentCases, allCases, allVictims, hotspots, recommendations, riskScores, reports] = await Promise.all([
      this.caseRepository.list({ page: 1, pageSize: 5 }),
      this.caseRepository.list({ page: 1, pageSize: 1 }),
      this.victimRepository.list({ page: 1, pageSize: 1 }),
      this.analyticsRepository.listHotspots({ page: 1, pageSize: 5 }),
      this.analyticsRepository.listRecommendations({ page: 1, pageSize: 5, status: 'pending' }),
      this.analyticsRepository.listRiskScores({ page: 1, pageSize: 5, reviewStatus: 'pending' }),
      this.analyticsRepository.listCrimeReviewReports({ page: 1, pageSize: 3 }),
    ]);

    const summaryCards: DashboardSummaryCard[] = [
      {
        label: 'Total Cases',
        value: allCases.meta.totalRecords,
        description: 'Operational FIR and case records available to the platform.',
      },
      {
        label: 'Total Victims',
        value: allVictims.meta.totalRecords,
        description: 'Victim records currently linked to known cases.',
      },
      {
        label: 'Active Hotspots',
        value: hotspots.meta.totalRecords,
        description: 'Hotspots currently visible under the selected default intelligence window.',
      },
      {
        label: 'Pending Recommendations',
        value: recommendations.meta.totalRecords,
        description: 'AI recommendations awaiting review or action.',
      },
    ];

    return {
      data: {
        summaryCards,
        recentCases: recentCases.items,
        activeHotspots: hotspots.items,
        pendingRecommendations: recommendations.items,
        pendingRiskScores: riskScores.items,
        latestCrimeReviewReports: reports.items,
      },
      warnings: this.buildOverviewWarnings(hotspots.items.length, recommendations.items.length),
      meta: {
        recentCases: recentCases.meta,
        activeHotspots: hotspots.meta,
        pendingRecommendations: recommendations.meta,
        pendingRiskScores: riskScores.meta,
        latestCrimeReviewReports: reports.meta,
      },
    };
  }

  async getOfficerDashboard(employeeId: bigint): Promise<ServiceResult<OfficerDashboard>> {
    const [assignedCases, recommendations, hotspots] = await Promise.all([
      this.officerRepository.listAssignedCases(employeeId, { page: 1, pageSize: 10 }),
      this.analyticsRepository.listRecommendations({ page: 1, pageSize: 10, status: 'pending' }),
      this.analyticsRepository.listHotspots({ page: 1, pageSize: 5 }),
    ]);

    const openHighPriorityRecommendations = recommendations.items.filter(
      (item) => item.priorityLevel?.toLowerCase() === 'high' || item.priorityLevel?.toLowerCase() === 'critical',
    );

    return {
      data: {
        officerId: employeeId.toString(),
        assignedCases: assignedCases.items,
        openHighPriorityRecommendations,
        hotspotAlerts: hotspots.items,
      },
      warnings: assignedCases.items.length === 0 ? ['The selected officer currently has no assigned cases in the system.'] : undefined,
      meta: {
        assignedCases: assignedCases.meta,
        recommendations: recommendations.meta,
        hotspots: hotspots.meta,
      },
    };
  }

  private buildOverviewWarnings(hotspotCount: number, recommendationCount: number): string[] | undefined {
    const warnings = new Set<string>();

    if (hotspotCount === 0) {
      warnings.add('No hotspot intelligence is currently available for the overview.');
    }

    if (recommendationCount === 0) {
      warnings.add('No pending AI recommendations are currently available for review.');
    }

    return warnings.size > 0 ? [...warnings] : undefined;
  }
}
