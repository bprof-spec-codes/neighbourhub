import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CreateMessageDto } from '../../../entities/dtos/create-message-dto.model';
import { IncomingMessageDto } from '../../../entities/dtos/incoming-message-dto.model';
import { ResidentService } from '../../../services/resident.service';
import { Resident } from '../../../entities/models/resident.model';
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
  protected residents: Resident[] = [];

  constructor(private fb: FormBuilder, private residentService: ResidentService) {
    this.form = this.fb.nonNullable.group({
      receiverId: ['', [Validators.required]],
      subject: ['', [Validators.required, Validators.maxLength(200)]],
      body: ['', [Validators.required]]
    });

    this.residentService.residents$.pipe(untilDestroyed(this)).subscribe(r => this.residents = r);
    this.residentService.loadResidents();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    const isOpenChange = changes['isOpen'];
    if (isOpenChange && isOpenChange.currentValue === true) {
      if (this.replyTo) {
        this.form.patchValue({
          receiverId: this.replyTo.senderId,
          subject: `Re: ${this.replyTo.subject}`
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
    this.form.markAsUntouched();
  }
}