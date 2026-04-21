import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { BookingService } from '../../services/booking.service';
import { CommunityRoomService } from '../../services/community-room.service';
import { AuthService } from '../../services/auth.service';
import { BookingListItem } from '../../entities/models/booking.model';
import { CommunityRoom } from '../../entities/models/community-room.model';
import { BookingCreateDto } from '../../entities/dtos/booking-create-dto.model';
import { CommunityRoomCreateDto } from '../../entities/dtos/community-room-create-dto.model';
import { CommunityRoomUpdateDto } from '../../entities/dtos/community-room-update-dto.model';

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
  protected isRoomModalOpen = false;
  protected selectedRoom: CommunityRoom | null = null;

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
    if (this.authService.isAdmin()) {
      this.communityRoomService.loadAllForAdmin();
    } else {
      this.communityRoomService.loadAll();
    }
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

  protected openAddRoomModal(): void {
    this.selectedRoom = null;
    this.isRoomModalOpen = true;
  }

  protected openEditRoomModal(room: CommunityRoom): void {
    this.selectedRoom = room;
    this.isRoomModalOpen = true;
  }

  protected closeRoomModal(): void {
    this.isRoomModalOpen = false;
    this.selectedRoom = null;
  }

  protected saveRoom(event: { id: string | null; dto: CommunityRoomCreateDto | CommunityRoomUpdateDto }): void {
    if (event.id) {
      this.communityRoomService.update(event.id, event.dto as CommunityRoomUpdateDto);
    } else {
      this.communityRoomService.create(event.dto as CommunityRoomCreateDto);
    }
    this.closeRoomModal();
  }

  protected deleteRoom(id: string): void {
    this.communityRoomService.delete(id);
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
