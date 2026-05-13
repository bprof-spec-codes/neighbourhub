import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
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

  constructor(private translate: TranslateService) {}

  protected onClose(): void {
    this.close.emit();
  }

  protected getCategoryText(category: string): string {
    return this.translate.instant(`ISSUES.CATEGORIES.${category.toUpperCase()}`);
  }

  protected getPriorityText(priority: string): string {
    return this.translate.instant(`ISSUES.PRIORITIES.${priority.toUpperCase()}`);
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
    return this.translate.instant(`ISSUES.STATUSES.${status.toUpperCase()}`);
  }
}
