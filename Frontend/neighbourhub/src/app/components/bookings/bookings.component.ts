import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
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
export class BookingsComponent implements OnInit, OnDestroy {
  protected rooms$;

  protected isCreateModalOpen = false;
  protected isRoomModalOpen = false;
  protected selectedRoom: CommunityRoom | null = null;
  protected preselectedRoomId: string | null = null;

  protected filterRoomId = '';
  protected filterDate = '';
  protected filterStatus = 'Active';
  protected filterPeriod = 'upcoming';

  protected filteredUpcoming: BookingListItem[] = [];
  protected filteredPast: BookingListItem[] = [];

  private allUpcoming: BookingListItem[] = [];
  private allPast: BookingListItem[] = [];
  private subs = new Subscription();

  constructor(
    private bookingService: BookingService,
    private communityRoomService: CommunityRoomService,
    protected authService: AuthService
  ) {
    this.rooms$ = this.communityRoomService.rooms$;
  }

  public ngOnInit(): void {
    this.subs.add(this.bookingService.upcomingBookings$.subscribe(b => {
      this.allUpcoming = b;
      this.applyFilters();
    }));
    this.subs.add(this.bookingService.pastBookings$.subscribe(b => {
      this.allPast = b;
      this.applyFilters();
    }));

    this.bookingService.loadAll();
    if (this.authService.isAdmin()) {
      this.communityRoomService.loadAllForAdmin();
    } else {
      this.communityRoomService.loadAll();
    }
  }

  public ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  protected onFilterChange(): void {
    this.applyFilters();
  }

  protected resetFilters(): void {
    this.filterRoomId = '';
    this.filterDate = '';
    this.filterStatus = 'Active';
    this.filterPeriod = 'upcoming';
    this.applyFilters();
  }

  private applyFilters(): void {
    const currentUserId = this.authService.getUserId();
    const filter = (list: BookingListItem[]) => list.filter(b => {
      if (this.filterRoomId && b.communityRoomId !== this.filterRoomId) return false;
      if (this.filterDate && b.bookingDate.substring(0, 10) !== this.filterDate) return false;
      if (this.filterStatus && b.status !== this.filterStatus) return false;
      if (this.filterPeriod === 'my' && b.bookedById !== currentUserId) return false;
      return true;
    });
    this.filteredUpcoming = filter(this.allUpcoming);
    this.filteredPast = filter(this.allPast);
  }

  protected openCreateModal(roomId: string | null = null): void {
    this.preselectedRoomId = roomId;
    this.isCreateModalOpen = true;
  }

  protected closeCreateModal(): void {
    this.isCreateModalOpen = false;
    this.preselectedRoomId = null;
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
      case 'Active': return 'status-active';
      case 'Cancelled': return 'status-cancelled';
      default: return '';
    }
  }

  protected formatTime(time: string): string {
    if (!time) return '';
    return time.substring(0, 5);
  }
}
