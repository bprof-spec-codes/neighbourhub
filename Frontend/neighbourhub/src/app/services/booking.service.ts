import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { BookingBackendService } from '../backend/booking-backend.service';
import { BookingListItem } from '../entities/models/booking.model';
import { BookingCreateDto } from '../entities/dtos/booking-create-dto.model';

@UntilDestroy()
@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private _upcomingBookings = new BehaviorSubject<BookingListItem[]>([]);
  public upcomingBookings$ = this._upcomingBookings.asObservable();

  private _pastBookings = new BehaviorSubject<BookingListItem[]>([]);
  public pastBookings$ = this._pastBookings.asObservable();

  constructor(private backendService: BookingBackendService) {}

  public loadMy(): void {
    this.backendService.getMy().pipe(untilDestroyed(this)).subscribe({
      next: (data) => {
        this._upcomingBookings.next(data.upcoming);
        this._pastBookings.next(data.past);
      },
      error: (err) => console.error('Failed to load bookings', err)
    });
  }

  public create(dto: BookingCreateDto): void {
    this.backendService.create(dto).pipe(untilDestroyed(this)).subscribe({
      next: () => this.loadMy(),
      error: (err) => console.error('Failed to create booking', err)
    });
  }

  public cancel(id: string): void {
    this.backendService.cancel(id).pipe(untilDestroyed(this)).subscribe({
      next: () => this.loadMy(),
      error: (err) => console.error('Failed to cancel booking', err)
    });
  }
}
