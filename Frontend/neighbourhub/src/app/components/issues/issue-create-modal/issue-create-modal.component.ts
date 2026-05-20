import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ErrorReportCreateDto } from '../../../entities/dtos/error-report-create-dto.model';

@Component({
  selector: 'app-issue-create-modal',
  standalone: false,
  templateUrl: './issue-create-modal.component.html',
  styleUrl: './issue-create-modal.component.scss'
})
export class IssueCreateModalComponent implements OnChanges {
  @Input() isOpen = false;

  @Output() add = new EventEmitter<ErrorReportCreateDto>();
  @Output() close = new EventEmitter<void>();

  protected readonly form;
  protected readonly categoryOptions: string[] = [
    'Plumbing', 'Electrical', 'HVAC', 'Maintenance', 'Structural', 'Other'
  ];

  constructor(private fb: FormBuilder, private translate: TranslateService) {
    this.form = this.fb.nonNullable.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      category: ['', [Validators.required]]
    });
  }

  public ngOnChanges(changes: SimpleChanges): void {
    const isOpenChange = changes['isOpen'];
    if (isOpenChange && isOpenChange.currentValue === true) {
      this.resetForm();
    }
  }

  protected onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const val = this.form.getRawValue();
    this.add.emit(new ErrorReportCreateDto(val.title, val.description, val.category));
    this.resetForm();
  }

  protected onClose(): void {
    this.close.emit();
  }

  protected isControlInvalid(controlName: 'title' | 'description' | 'category'): boolean {
    const control = this.form.controls[controlName];
    return control.touched && control.invalid;
  }

  protected getErrorText(controlName: 'title' | 'description' | 'category'): string {
    const control = this.form.controls[controlName];
    if (control.errors?.['required']) {
      switch (controlName) {
        case 'title': return this.translate.instant('ISSUES.CREATE_MODAL.VALIDATION.TITLE_REQUIRED');
        case 'description': return this.translate.instant('ISSUES.CREATE_MODAL.VALIDATION.DESCRIPTION_REQUIRED');
        default: return this.translate.instant('ISSUES.CREATE_MODAL.VALIDATION.CATEGORY_REQUIRED');
      }
    }
    return this.translate.instant('ISSUES.CREATE_MODAL.VALIDATION.INVALID_VALUE');
  }

  private resetForm(): void {
    this.form.reset({ title: '', description: '', category: '' });
    this.form.markAsUntouched();
  }
}
