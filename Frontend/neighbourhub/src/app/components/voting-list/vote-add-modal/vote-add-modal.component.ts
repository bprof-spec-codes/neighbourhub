import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { VoteAddDto } from '../../../entities/dtos/vote-add-dto.model';

@Component({
  selector: 'app-vote-add-modal',
  standalone: false,
  templateUrl: './vote-add-modal.component.html',
  styleUrl: './vote-add-modal.component.scss'
})
export class VoteAddModalComponent implements OnChanges {

  @Input() isOpen = false;

  @Output() add = new EventEmitter<VoteAddDto>();
  @Output() close = new EventEmitter<void>();

  protected readonly form;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.nonNullable.group({
      title: ['', [Validators.required]],
      deadline: ['', [Validators.required]]
    });
  }

  public ngOnChanges(changes: SimpleChanges): void {
    const isOpenChange = changes['isOpen'];
    if (isOpenChange && isOpenChange.currentValue === true) {
      this.resetFormToDefault();
    }
  }

  protected onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();
    this.add.emit(new VoteAddDto(raw.title, raw.deadline));
    this.resetFormToDefault();
  }

  protected onClose(): void {
    this.close.emit();
  }

  protected isControlInvalid(controlName: 'title' | 'deadline'): boolean {
    const control = this.form.controls[controlName];
    return control.touched && control.invalid;
  }

  protected getErrorText(controlName: 'title' | 'deadline'): string {
    const control = this.form.controls[controlName];
    if (control.errors?.['required']) {
      return controlName === 'title' ? 'Question is required.' : 'Deadline is required.';
    }
    return 'Invalid value.';
  }

  private resetFormToDefault(): void {
    this.form.reset({ title: '', deadline: '' });
    this.form.markAsUntouched();
  }


}
