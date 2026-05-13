import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { CreateMessageDto } from '../../../entities/dtos/create-message-dto.model';
import { IncomingMessageDto } from '../../../entities/dtos/incoming-message-dto.model';
import { MessageBackendService } from '../../../backend/message-backend.service';
import { RecipientDto } from '../../../entities/dtos/recipient-dto.model';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-message-new-modal',
  standalone: false,
  templateUrl: './message-new-modal.component.html',
  styleUrl: './message-new-modal.component.scss'
})
export class MessageNewModalComponent implements OnChanges {
  @Input() isOpen = false;
  @Input() replyTo: IncomingMessageDto | null = null;

  @Output() send = new EventEmitter<CreateMessageDto>();
  @Output() close = new EventEmitter<void>();

  protected readonly form;
  protected recipients: RecipientDto[] = [];
  protected searchTerm = '';

  protected selectedRecipient: RecipientDto | null = null
  protected showDropdown = false;

  constructor(
    private fb: FormBuilder,
    private messageBackendService: MessageBackendService,
    private translate: TranslateService
  ) {
    this.form = this.fb.nonNullable.group({
      receiverId: ['', [Validators.required]],
      subject: ['', [Validators.required, Validators.maxLength(200)]],
      body: ['', [Validators.required]]
    });
  }

  public ngOnChanges(changes: SimpleChanges): void {
    const isOpenChange = changes['isOpen'];
    if (isOpenChange && isOpenChange.currentValue === true) {
      this.messageBackendService.getRecipients().pipe(untilDestroyed(this)).subscribe(r => {
        this.recipients = r;
      });
      if (this.replyTo) {
        this.form.patchValue({
          receiverId: this.replyTo.senderId,
          subject: `${this.translate.instant('MESSAGING.NEW_MODAL.RE_PREFIX')}: ${this.replyTo.subject}`
        });
      } else {
        this.resetForm();
      }
    }
  }

  protected onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const val = this.form.getRawValue();
    this.send.emit(new CreateMessageDto(
      val.receiverId,
      val.subject,
      val.body,
      this.replyTo?.id ?? null
    ));
    this.resetForm();
  }

  protected onClose(): void {
    this.close.emit();
  }

  protected isControlInvalid(controlName: 'receiverId' | 'subject' | 'body'): boolean {
    const control = this.form.controls[controlName];
    return control.touched && control.invalid;
  }

  private resetForm(): void {
    this.form.reset({ receiverId: '', subject: '', body: '' });
    this.searchTerm = '';
    this.selectedRecipient = null;
    this.showDropdown = false;
    this.form.markAsUntouched();
  }

  protected get filteredRecipients(): RecipientDto[] {
    const term = this.searchTerm.toLowerCase();
    if (!term) return this.recipients;
    return this.recipients.filter(r =>
      (r.firstName + ' ' + r.lastName).toLowerCase().includes(term) ||
      r.apartmentNumber?.some(a => a.toLowerCase().includes(term))
    );
  }

  

  protected onSearchInput(event: Event): void {
    this.searchTerm = (event.target as HTMLInputElement).value;
    this.showDropdown = this.searchTerm.length > 0;
    this.selectedRecipient = null;
    this.form.patchValue({ receiverId: '' });
  }

  protected selectRecipient(recipient: RecipientDto): void {
    this.selectedRecipient = recipient;
    this.searchTerm = `${recipient.firstName} ${recipient.lastName}`;
    if (recipient.apartmentNumber.length) {
      this.searchTerm += ` (${recipient.apartmentNumber.join(', ')})`;
    }
    this.form.patchValue({ receiverId: recipient.id });
    this.showDropdown = false;
  }
}