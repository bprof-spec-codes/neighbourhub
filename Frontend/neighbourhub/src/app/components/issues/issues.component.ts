import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ErrorReportService } from '../../services/error-report.service';
import { AuthService } from '../../services/auth.service';
import { ErrorReportListItem, ErrorReportDetail, ErrorReportSummary } from '../../entities/models/error-report.model';
import { ErrorReportCreateDto } from '../../entities/dtos/error-report-create-dto.model';
import { ErrorReportUpdateDto } from '../../entities/dtos/error-report-update-dto.model';

@Component({
  selector: 'app-issues',
  standalone: false,
  templateUrl: './issues.component.html',
  styleUrl: './issues.component.scss'
})
export class IssuesComponent implements OnInit {
  protected errorReports$ = new Observable<ErrorReportListItem[]>();
  protected summary$ = new Observable<ErrorReportSummary>();
  protected selectedReport$ = new Observable<ErrorReportDetail | null>();

  protected isAddModalOpen = false;
  protected isViewModalOpen = false;
  protected isEditModalOpen = false;
  protected isDeleteModalOpen = false;

  private idToDelete = '';

  constructor(
    private errorReportService: ErrorReportService,
    private authService: AuthService
  ) {}

  public ngOnInit(): void {
    this.errorReportService.loadAll();
    this.errorReportService.loadSummary();
    this.errorReports$ = this.errorReportService.errorReports$;
    this.summary$ = this.errorReportService.summary$;
    this.selectedReport$ = this.errorReportService.selectedReport$;
  }

  protected canModifyReport(report: ErrorReportListItem): boolean {
    return this.authService.isAdmin() || report.reportedById === this.authService.getUserId();
  }

  protected openAddModal(): void {
    this.isAddModalOpen = true;
  }

  protected closeAddModal(): void {
    this.isAddModalOpen = false;
  }

  protected addErrorReport(dto: ErrorReportCreateDto): void {
    this.errorReportService.create(dto);
    this.closeAddModal();
  }

  protected openViewModal(id: string): void {
    this.errorReportService.loadById(id);
    this.isViewModalOpen = true;
  }

  protected closeViewModal(): void {
    this.isViewModalOpen = false;
  }

  protected openEditModal(id: string): void {
    this.errorReportService.loadById(id);
    this.isEditModalOpen = true;
  }

  protected closeEditModal(): void {
    this.isEditModalOpen = false;
  }

  protected updateErrorReport(event: { id: string; dto: ErrorReportUpdateDto }): void {
    this.errorReportService.update(event.id, event.dto);
    this.closeEditModal();
  }

  protected openDeleteModal(id: string): void {
    this.idToDelete = id;
    this.isDeleteModalOpen = true;
  }

  protected closeDeleteModal(): void {
    this.isDeleteModalOpen = false;
  }

  protected deleteErrorReport(): void {
    if (this.idToDelete === '') return;
    this.errorReportService.delete(this.idToDelete);
    this.closeDeleteModal();
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
