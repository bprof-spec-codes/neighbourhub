import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ErrorReportBackendService } from '../backend/error-report-backend.service';
import { ErrorReportListItem, ErrorReportDetail, ErrorReportSummary } from '../entities/models/error-report.model';
import { ErrorReportCreateDto } from '../entities/dtos/error-report-create-dto.model';
import { ErrorReportUpdateDto } from '../entities/dtos/error-report-update-dto.model';

@UntilDestroy()
@Injectable({
  providedIn: 'root'
})
export class ErrorReportService {
  private _errorReports = new BehaviorSubject<ErrorReportListItem[]>([]);
  public errorReports$ = this._errorReports.asObservable();

  private _summary = new BehaviorSubject<ErrorReportSummary>({ total: 0, open: 0, inProgress: 0, resolved: 0 });
  public summary$ = this._summary.asObservable();

  private _selectedReport = new BehaviorSubject<ErrorReportDetail | null>(null);
  public selectedReport$ = this._selectedReport.asObservable();

  constructor(private backendService: ErrorReportBackendService) {}

  public loadAll(status?: string, category?: string, priority?: string): void {
    this.backendService.getAll(status, category, priority).pipe(untilDestroyed(this)).subscribe({
      next: (reports) => this._errorReports.next(reports),
      error: (err) => console.error('Failed to load error reports', err)
    });
  }

  public loadSummary(): void {
    this.backendService.getSummary().pipe(untilDestroyed(this)).subscribe({
      next: (summary) => this._summary.next(summary),
      error: (err) => console.error('Failed to load summary', err)
    });
  }

  public loadById(id: string): void {
    this.backendService.getById(id).pipe(untilDestroyed(this)).subscribe({
      next: (report) => this._selectedReport.next(report),
      error: (err) => console.error('Failed to load error report', err)
    });
  }

  public create(dto: ErrorReportCreateDto): void {
    this.backendService.create(dto).pipe(untilDestroyed(this)).subscribe({
      next: () => {
        this.loadAll();
        this.loadSummary();
      },
      error: (err) => console.error('Failed to create error report', err)
    });
  }

  public update(id: string, dto: ErrorReportUpdateDto): void {
    this.backendService.update(id, dto).pipe(untilDestroyed(this)).subscribe({
      next: () => {
        this.loadAll();
        this.loadSummary();
      },
      error: (err) => console.error('Failed to update error report', err)
    });
  }

  public delete(id: string): void {
    this.backendService.delete(id).pipe(untilDestroyed(this)).subscribe({
      next: () => {
        this.loadAll();
        this.loadSummary();
      },
      error: (err) => console.error('Failed to delete error report', err)
    });
  }
}
