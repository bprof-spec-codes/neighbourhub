import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CommunityRoom } from '../../../entities/models/community-room.model';
import { BookingCreateDto } from '../../../entities/dtos/booking-create-dto.model';

@Component({
  selector: 'app-booking-create-modal',
  standalone: false,
  templateUrl: './booking-create-modal.component.html',
  styleUrl: './booking-create-modal.component.scss'
})
export class BookingCreateModalComponent implements OnChanges {
  @Input() isOpen = false;
  @Input() rooms: CommunityRoom[] = [];

  @Output() add = new EventEmitter<BookingCreateDto>();
  @Output() close = new EventEmitter<void>();

  protected readonly form;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.nonNullable.group({
      communityRoomId: ['', Validators.required],
      bookingDate: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      numberOfPeople: [1, [Validators.required, Validators.min(1)]]
    });
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen']?.currentValue === true) {
      this.form.reset({ numberOfPeople: 1 });
      this.form.markAsUntouched();
    }
  }

  protected onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const v = this.form.getRawValue();
    this.add.emit(new BookingCreateDto(
      v.communityRoomId,
      v.bookingDate,
      v.startTime + ':00',
      v.endTime + ':00',
      v.numberOfPeople
    ));
  }

  protected onClose(): void {
    this.close.emit();
  }

  protected isInvalid(field: string): boolean {
    const control = this.form.get(field);
    return !!control && control.touched && control.invalid;
  }
}
