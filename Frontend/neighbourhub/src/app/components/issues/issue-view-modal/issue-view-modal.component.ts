import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ErrorReportDetail } from '../../../entities/models/error-report.model';
import { ErrorReportUpdateDto } from '../../../entities/dtos/error-report-update-dto.model';

@Component({
  selector: 'app-issue-view-modal',
  standalone: false,
  templateUrl: './issue-view-modal.component.html',
  styleUrl: './issue-view-modal.component.scss'
})
export class IssueViewModalComponent implements OnChanges {
  @Input() isOpen = false;
  @Input() report: ErrorReportDetail | null = null;
  @Input() canModify = false;

  @Output() close = new EventEmitter<void>();
  @Output() deleteReport = new EventEmitter<string>();
  @Output() updateReport = new EventEmitter<{ id: string; dto: ErrorReportUpdateDto }>();

  protected isEditing = false;
  protected form!: FormGroup;

  protected categoryOptions = ['Plumbing', 'Electrical', 'HVAC', 'Maintenance', 'Structural', 'Other'];
  protected priorityOptions = ['Low', 'Medium', 'High'];
  protected statusOptions = ['Open', 'InProgress', 'Resolved'];

  constructor(private fb: FormBuilder) {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen'] && !this.isOpen) {
      this.isEditing = false;
    }
  }

  private initForm(): void {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      category: ['', Validators.required],
      priority: ['', Validators.required],
      status: ['', Validators.required],
      scheduledRepairDate: ['']
    });
  }

  protected onEdit(): void {
    if (!this.report) return;
    this.form.patchValue({
      title: this.report.title,
      description: this.report.description,
      category: this.report.category,
      priority: this.report.priority,
      status: this.report.status,
      scheduledRepairDate: this.report.scheduledRepairDate
        ? this.report.scheduledRepairDate.substring(0, 10)
        : ''
    });
    this.isEditing = true;
  }

  protected onCancelEdit(): void {
    this.isEditing = false;
  }

  protected onSave(): void {
    if (!this.report || this.form.invalid) return;
    const v = this.form.value;
    const dto = new ErrorReportUpdateDto(
      v.title,
      v.description,
      v.category,
      v.priority,
      v.status,
      v.scheduledRepairDate || null
    );
    this.updateReport.emit({ id: this.report.id, dto });
    this.isEditing = false;
  }

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
