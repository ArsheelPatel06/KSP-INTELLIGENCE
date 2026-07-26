import type {
  CrimeReviewReportRecord,
  HotspotRecord,
  RecommendationRecord,
  RiskScoreRecord,
} from '@modules/analytics/types/analytics.types';
import type { CaseListItem } from '@modules/cases/types/case.types';
import type { OfficerAssignedCaseItem } from '@modules/officers/types/officer.types';

export interface DashboardSummaryCard {
  label: string;
  value: number;
  description: string;
}

export interface DashboardOverview {
  summaryCards: DashboardSummaryCard[];
  recentCases: CaseListItem[];
  activeHotspots: HotspotRecord[];
  pendingRecommendations: RecommendationRecord[];
  pendingRiskScores: RiskScoreRecord[];
  latestCrimeReviewReports: CrimeReviewReportRecord[];
}

export interface OfficerDashboard {
  officerId: string;
  assignedCases: OfficerAssignedCaseItem[];
  openHighPriorityRecommendations: RecommendationRecord[];
  hotspotAlerts: HotspotRecord[];
}
