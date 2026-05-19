export interface ErrorReportListItem {
  id: string;
  title: string;
  category: string;
  priority: string;
  status: string;
  scheduledRepairDate: string | null;
  reportedById: string;
  commentCount: number;
}

export interface ErrorReportDetail {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  reportedDate: string;
  scheduledRepairDate: string | null;
  reportedById: string;
  reportedByName: string;
}

export interface ErrorReportSummary {
  total: number;
  open: number;
  inProgress: number;
  resolved: number;
}
