import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ErrorReportDetail } from '../../../entities/models/error-report.model';
import { ErrorReportUpdateDto } from '../../../entities/dtos/error-report-update-dto.model';

@Component({
  selector: 'app-issue-edit-modal',
  standalone: false,
  templateUrl: './issue-edit-modal.component.html',
  styleUrl: './issue-edit-modal.component.scss'
})
export class IssueEditModalComponent implements OnChanges {
  @Input() isOpen = false;
  @Input() report: ErrorReportDetail | null = null;

  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<{ id: string; dto: ErrorReportUpdateDto }>();

  protected form!: FormGroup;

  protected categoryOptions = ['Plumbing', 'Electrical', 'HVAC', 'Maintenance', 'Structural', 'Other'];
  protected priorityOptions = ['Low', 'Medium', 'High'];
  protected statusOptions = ['Open', 'InProgress', 'Resolved'];
  protected minScheduledDate = this.getTodayDateString();

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      category: ['', Validators.required],
      priority: ['', Validators.required],
      status: ['', Validators.required],
      scheduledRepairDate: ['', [this.notPastDateValidator()]]
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['report'] && this.report) {
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
    }
  }

  protected onSubmit(): void {
    if (!this.report || this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.value;
    const dto = new ErrorReportUpdateDto(
      v.title,
      v.description,
      v.category,
      v.priority,
      v.status,
      v.scheduledRepairDate || null
    );
    this.save.emit({ id: this.report.id, dto });
  }

  protected onClose(): void {
    this.close.emit();
  }

  protected isScheduledRepairDateInvalid(): boolean {
    const control = this.form.get('scheduledRepairDate');
    return !!control && control.touched && control.hasError('pastDate');
  }

  private notPastDateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value as string | null;
      if (!value) {
        return null;
      }

      const selected = new Date(value);
      selected.setHours(0, 0, 0, 0);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      return selected < today ? { pastDate: true } : null;
    };
  }

  private getTodayDateString(): string {
    return new Date().toISOString().split('T')[0];
  }
}
