import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { BookingService } from '../../services/booking.service';
import { CommunityRoomService } from '../../services/community-room.service';
import { AuthService } from '../../services/auth.service';
import { BookingListItem } from '../../entities/models/booking.model';
import { CommunityRoom } from '../../entities/models/community-room.model';
import { BookingCreateDto } from '../../entities/dtos/booking-create-dto.model';

@Component({
  selector: 'app-bookings',
  standalone: false,
  templateUrl: './bookings.component.html',
  styleUrl: './bookings.component.scss'
})
export class BookingsComponent implements OnInit {
  protected upcomingBookings$: Observable<BookingListItem[]>;
  protected pastBookings$: Observable<BookingListItem[]>;
  protected rooms$: Observable<CommunityRoom[]>;

  protected isCreateModalOpen = false;

  constructor(
    private bookingService: BookingService,
    private communityRoomService: CommunityRoomService,
    protected authService: AuthService
  ) {
    this.upcomingBookings$ = this.bookingService.upcomingBookings$;
    this.pastBookings$ = this.bookingService.pastBookings$;
    this.rooms$ = this.communityRoomService.rooms$;
  }

  public ngOnInit(): void {
    this.bookingService.loadMy();
    this.communityRoomService.loadAll();
  }

  protected openCreateModal(): void {
    this.isCreateModalOpen = true;
  }

  protected closeCreateModal(): void {
    this.isCreateModalOpen = false;
  }

  protected createBooking(dto: BookingCreateDto): void {
    this.bookingService.create(dto);
    this.closeCreateModal();
  }

  protected cancelBooking(id: string): void {
    this.bookingService.cancel(id);
  }

  protected getStatusClass(status: string): string {
    switch (status) {
      case 'Confirmed': return 'status-confirmed';
      case 'Pending': return 'status-pending';
      case 'Cancelled': return 'status-cancelled';
      default: return '';
    }
  }

  protected formatTime(time: string): string {
    if (!time) return '';
    return time.substring(0, 5);
  }
}
