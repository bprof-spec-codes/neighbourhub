import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CommunityRoom } from '../../../entities/models/community-room.model';
import { BookingSlot } from '../../../entities/models/booking.model';
import { BookingCreateDto } from '../../../entities/dtos/booking-create-dto.model';
import { BookingService } from '../../../services/booking.service';

@Component({
  selector: 'app-booking-create-modal',
  standalone: false,
  templateUrl: './booking-create-modal.component.html',
  styleUrl: './booking-create-modal.component.scss'
})
export class BookingCreateModalComponent implements OnChanges, OnDestroy {
  @Input() isOpen = false;
  @Input() rooms: CommunityRoom[] = [];
  @Input() preselectedRoomId: string | null = null;

  @Output() add = new EventEmitter<BookingCreateDto>();
  @Output() close = new EventEmitter<void>();

  protected readonly form;
  protected bookedSlots: BookingSlot[] = [];
  protected hasConflict = false;
  protected selectedRoomCapacity: number | null = null;

  private availabilitySub?: Subscription;

  constructor(private fb: FormBuilder, private bookingService: BookingService) {
    this.form = this.fb.nonNullable.group({
      communityRoomId: ['', Validators.required],
      bookingDate: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      numberOfPeople: [1, [Validators.required, Validators.min(1)]]
    });

    this.availabilitySub = this.bookingService.availability$.subscribe(slots => {
      this.bookedSlots = slots;
      this.checkConflict();
    });

    this.form.valueChanges.subscribe(() => this.checkConflict());

    this.form.get('communityRoomId')!.valueChanges.subscribe((roomId) => {
      this.fetchAvailability();
      const room = this.rooms.find(r => r.id === roomId) ?? null;
      this.selectedRoomCapacity = room ? room.capacity : null;
      const ctrl = this.form.get('numberOfPeople')!;
      ctrl.setValidators([Validators.required, Validators.min(1), ...(room ? [Validators.max(room.capacity)] : [])]);
      ctrl.updateValueAndValidity();
    });
    this.form.get('bookingDate')!.valueChanges.subscribe(() => this.fetchAvailability());
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen']?.currentValue === true) {
      this.form.reset({ numberOfPeople: 1, communityRoomId: this.preselectedRoomId ?? '' });
      this.form.markAsUntouched();
      this.bookedSlots = [];
      this.hasConflict = false;
    }
  }

  public ngOnDestroy(): void {
    this.availabilitySub?.unsubscribe();
  }

  private fetchAvailability(): void {
    const roomId = this.form.get('communityRoomId')!.value;
    const date = this.form.get('bookingDate')!.value;
    if (roomId && date) {
      this.bookingService.loadAvailability(roomId, date);
    } else {
      this.bookedSlots = [];
    }
  }

  private timeToMinutes(time: string): number {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
  }

  private checkConflict(): void {
    const start = this.form.get('startTime')!.value;
    const end = this.form.get('endTime')!.value;
    if (!start || !end) { this.hasConflict = false; return; }

    const startMin = this.timeToMinutes(start);
    const endMin = this.timeToMinutes(end);

    this.hasConflict = this.bookedSlots.some(slot => {
      const slotStart = this.timeToMinutes(slot.startTime.substring(0, 5));
      const slotEnd = this.timeToMinutes(slot.endTime.substring(0, 5));
      return startMin < slotEnd && endMin > slotStart;
    });
  }

  protected getSlotStyle(slot: BookingSlot): { left: string; width: string } {
    const start = this.timeToMinutes(slot.startTime.substring(0, 5));
    const end = this.timeToMinutes(slot.endTime.substring(0, 5));
    const totalMinutes = 24 * 60;
    return {
      left: (start / totalMinutes * 100) + '%',
      width: ((end - start) / totalMinutes * 100) + '%'
    };
  }

  protected getSelectionStyle(): { left: string; width: string } | null {
    const start = this.form.get('startTime')!.value;
    const end = this.form.get('endTime')!.value;
    if (!start || !end) return null;

    const startMin = this.timeToMinutes(start);
    const endMin = this.timeToMinutes(end);
    if (endMin <= startMin) return null;

    const totalMinutes = 24 * 60;
    return {
      left: (startMin / totalMinutes * 100) + '%',
      width: ((endMin - startMin) / totalMinutes * 100) + '%'
    };
  }

  protected getHourMarkers(): number[] {
    return Array.from({ length: 25 }, (_, i) => i);
  }

  protected onSubmit(): void {
    if (this.form.invalid || this.hasConflict) {
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
