import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AnnouncementCategory } from '../../../entities/enums/announcement-category.model';
import { AnnouncementAddDto } from '../../../entities/dtos/announcement-add-dto.model';

@Component({
  selector: 'app-announcement-add-modal',
  standalone: false,
  templateUrl: './announcement-add-modal.component.html',
  styleUrl: './announcement-add-modal.component.scss'
})
export class AnnouncementAddModalComponent implements OnChanges {
  @Input() isOpen = false;

  @Output() add = new EventEmitter<AnnouncementAddDto>();
  @Output() close = new EventEmitter<void>();

  protected readonly announcementCategory = AnnouncementCategory;
  protected readonly form;
  protected readonly categoryOptions: AnnouncementCategory[] = [
    AnnouncementCategory.Maintenance,
    AnnouncementCategory.Event,
    AnnouncementCategory.Policy,
    AnnouncementCategory.General
  ];

  constructor(private fb: FormBuilder) {
    this.form = this.fb.nonNullable.group({
      title: ['', [Validators.required]],
      content: ['', [Validators.required]],
      category: [AnnouncementCategory.General, [Validators.required]]
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

    this.add.emit(new AnnouncementAddDto(
      this.form.getRawValue().title,
      this.form.getRawValue().content,
      this.form.getRawValue().category
    ));
    this.resetFormToDefault();
  }
  
  protected onClose(): void {
    this.close.emit();
  }

  protected getCategoryText(category: AnnouncementCategory): string {
    return this.announcementCategory[category];
  }

  protected isControlInvalid(controlName: 'title' | 'content' | 'category'): boolean {
    const control = this.form.controls[controlName];
    return control.touched && control.invalid;
  }

  protected getErrorText(controlName: 'title' | 'content' | 'category'): string {
    const control = this.form.controls[controlName];

    if (control.errors?.['required']) {
      switch (controlName) {
        case 'title':
          return 'Title is required.';
        case 'content':
          return 'Content is required.';
        default:
          return 'Category is required.';
      }
    }

    return 'Invalid value.';
  }

  private resetFormToDefault(): void {
    this.form.reset({
      title: '',
      content: '',
      category: AnnouncementCategory.General
    });
    this.form.markAsUntouched();
  }
}
