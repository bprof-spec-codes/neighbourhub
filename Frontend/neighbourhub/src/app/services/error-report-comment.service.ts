import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ErrorReportCommentBackendService } from '../backend/error-report-comment-backend.service';
import { ErrorReportCommentListItem } from '../entities/models/error-report-comment.model';
import { ErrorReportCommentCreateDto } from '../entities/dtos/error-report-comment-create-dto.model';

@UntilDestroy()
@Injectable({
  providedIn: 'root'
})
export class ErrorReportCommentService {
  private _comments = new BehaviorSubject<ErrorReportCommentListItem[]>([]);
  public comments$ = this._comments.asObservable();

  constructor(private backendService: ErrorReportCommentBackendService) {}

  public loadByErrorReport(errorReportId: string): void {
    this._comments.next([]);
    this.backendService.getByErrorReport(errorReportId).pipe(untilDestroyed(this)).subscribe({
      next: (comments) => this._comments.next(comments),
      error: (err) => console.error('Failed to load comments', err)
    });
  }

  public add(errorReportId: string, dto: ErrorReportCommentCreateDto, onSuccess: () => void): void {
    this.backendService.add(errorReportId, dto).pipe(untilDestroyed(this)).subscribe({
      next: () => {
        this.loadByErrorReport(errorReportId);
        onSuccess();
      },
      error: (err) => console.error('Failed to add comment', err)
    });
  }

  public delete(errorReportId: string, commentId: string, onSuccess?: () => void): void {
    this.backendService.delete(errorReportId, commentId).pipe(untilDestroyed(this)).subscribe({
      next: () => {
        this.loadByErrorReport(errorReportId);
        onSuccess?.();
      },
      error: (err) => console.error('Failed to delete comment', err)
    });
  }
}
