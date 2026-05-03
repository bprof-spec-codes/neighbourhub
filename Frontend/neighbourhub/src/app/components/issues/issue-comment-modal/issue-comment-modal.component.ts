import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { ErrorReportCommentService } from '../../../services/error-report-comment.service';
import { UntilDestroy } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-issue-comment-modal',
  standalone: false,
  templateUrl: './issue-comment-modal.component.html',
  styleUrl: './issue-comment-modal.component.scss'
})
export class IssueCommentModalComponent implements OnChanges {
  @Input() isOpen = false;
  @Input() errorReportId: string | null = null;
  @Input() currentUserId: string | null = null;
  @Input() isAdmin = false;

  @Output() close = new EventEmitter<void>();

  protected comments$;
  protected newContent = '';

  constructor(private commentService: ErrorReportCommentService) {
    this.comments$ = commentService.comments$;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen']?.currentValue === true && this.errorReportId) {
      this.commentService.loadByErrorReport(this.errorReportId);
      this.newContent = '';
    }
  }

  protected submit(): void {
    const content = this.newContent.trim();
    if (!content || !this.errorReportId) return;
    this.commentService.add(this.errorReportId, { content }, () => {
      this.newContent = '';
    });
  }

  protected deleteComment(commentId: string): void {
    if (this.errorReportId) {
      this.commentService.delete(this.errorReportId, commentId);
    }
  }

  protected canDelete(authorId: string): boolean {
    return this.isAdmin || authorId === this.currentUserId;
  }

  protected onClose(): void {
    this.close.emit();
  }
}
