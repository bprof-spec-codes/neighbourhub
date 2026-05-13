import { Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { DocumentAddDto } from '../../../entities/dtos/document-add-dto.model';

@Component({
  selector: 'app-add-document-modal',
  standalone: false,
  templateUrl: './add-document-modal.component.html',
  styleUrl: './add-document-modal.component.scss'
})
export class AddDocumentModalComponent implements OnChanges {
  @Input() isOpen = false;

  @Output() add = new EventEmitter<DocumentAddDto>();
  @Output() close = new EventEmitter<void>();

  @ViewChild('fileInput') private fileInput?: ElementRef<HTMLInputElement>;

  protected readonly form;
  protected fileTypeError = false;
  protected isDragOver = false;

  constructor(private fb: FormBuilder, private translate: TranslateService) {
    this.form = this.fb.nonNullable.group({
      title: ['', [Validators.required]],
      file: [null as File | null, [Validators.required]]
    });
  }

  public ngOnChanges(changes: SimpleChanges): void {
    const isOpenChange = changes['isOpen'];

    if (isOpenChange && isOpenChange.currentValue === true) {
      this.resetFormToDefault();
    }
  }

  protected onSubmit(): void {
    if (this.form.invalid || this.fileTypeError) {
      this.form.markAllAsTouched();
      return;
    }

    const rawValue = this.form.getRawValue();
    const selectedFile = rawValue.file;

    if (!selectedFile) {
      return;
    }

    this.add.emit(new DocumentAddDto(rawValue.title, selectedFile));
    this.resetFormToDefault();
  }

  protected onClose(): void {
    this.close.emit();
  }

  protected onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const selectedFile = input.files?.[0] ?? null;

    this.fileTypeError = false;

    if (!selectedFile) {
      this.form.controls.file.setValue(null);
      this.form.controls.file.markAsTouched();
      return;
    }

    const isPdf = selectedFile.type === 'application/pdf' || selectedFile.name.toLowerCase().endsWith('.pdf');

    if (!isPdf) {
      this.fileTypeError = true;
      this.form.controls.file.setValue(null);
      this.form.controls.file.markAsTouched();
      input.value = '';
      return;
    }

    this.form.controls.file.setValue(selectedFile);
    this.form.controls.file.markAsTouched();
  }

  protected openFilePicker(): void {
    this.fileInput?.nativeElement.click();
  }

  protected onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = true;
  }

  protected onDragLeave(): void {
    this.isDragOver = false;
  }

  protected onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;

    const selectedFile = event.dataTransfer?.files?.[0] ?? null;
    const input = this.fileInput?.nativeElement;

    if (input) {
      input.value = '';
    }

    this.fileTypeError = false;

    if (!selectedFile) {
      this.form.controls.file.setValue(null);
      this.form.controls.file.markAsTouched();
      return;
    }

    const isPdf = selectedFile.type === 'application/pdf' || selectedFile.name.toLowerCase().endsWith('.pdf');

    if (!isPdf) {
      this.fileTypeError = true;
      this.form.controls.file.setValue(null);
      this.form.controls.file.markAsTouched();
      return;
    }

    this.form.controls.file.setValue(selectedFile);
    this.form.controls.file.markAsTouched();
  }

  protected isControlInvalid(controlName: 'title' | 'file'): boolean {
    const control = this.form.controls[controlName];
    return control.touched && control.invalid;
  }

  protected getSelectedFileName(): string {
    return this.form.controls.file.value?.name ?? this.translate.instant('DOCUMENTS.ADD_MODAL.NO_FILE_SELECTED');
  }

  protected getErrorText(controlName: 'title' | 'file'): string {
    if (controlName === 'file' && this.fileTypeError) {
      return this.translate.instant('DOCUMENTS.ADD_MODAL.VALIDATION.ONLY_PDF');
    }

    const control = this.form.controls[controlName];

    if (control.errors?.['required']) {
      return controlName === 'title'
        ? this.translate.instant('DOCUMENTS.ADD_MODAL.VALIDATION.TITLE_REQUIRED')
        : this.translate.instant('DOCUMENTS.ADD_MODAL.VALIDATION.PDF_REQUIRED');
    }

    return this.translate.instant('DOCUMENTS.ADD_MODAL.VALIDATION.INVALID_VALUE');
  }

  private resetFormToDefault(): void {
    this.form.reset({
      title: '',
      file: null
    });
    this.fileTypeError = false;
    this.isDragOver = false;
    this.form.markAsUntouched();
  }

}
