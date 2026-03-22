import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ErrorReportDetail } from '../../../entities/models/error-report.model';

@Component({
  selector: 'app-issue-view-modal',
  standalone: false,
  templateUrl: './issue-view-modal.component.html',
  styleUrl: './issue-view-modal.component.scss'
})
export class IssueViewModalComponent {
  @Input() isOpen = false;
  @Input() report: ErrorReportDetail | null = null;

  @Output() close = new EventEmitter<void>();
  @Output() deleteReport = new EventEmitter<string>();

  protected onClose(): void {
    this.close.emit();
  }

  protected onDelete(): void {
    if (this.report) {
      this.deleteReport.emit(this.report.id);
    }
  }

  protected getPriorityClass(priority: string): string {
    switch (priority) {
      case 'High': return 'priority-high';
      case 'Medium': return 'priority-medium';
      case 'Low': return 'priority-low';
      default: return '';
    }
  }

  protected getStatusClass(status: string): string {
    switch (status) {
      case 'Open': return 'status-open';
      case 'InProgress': return 'status-in-progress';
      case 'Resolved': return 'status-resolved';
      default: return '';
    }
  }

  protected getStatusText(status: string): string {
    return status === 'InProgress' ? 'In Progress' : status;
  }
}
