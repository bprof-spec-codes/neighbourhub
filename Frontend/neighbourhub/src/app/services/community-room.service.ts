import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { CommunityRoomBackendService } from '../backend/community-room-backend.service';
import { CommunityRoom } from '../entities/models/community-room.model';
import { CommunityRoomCreateDto } from '../entities/dtos/community-room-create-dto.model';
import { CommunityRoomUpdateDto } from '../entities/dtos/community-room-update-dto.model';

@UntilDestroy()
@Injectable({
  providedIn: 'root'
})
export class CommunityRoomService {
  private _rooms = new BehaviorSubject<CommunityRoom[]>([]);
  public rooms$ = this._rooms.asObservable();

  constructor(private backendService: CommunityRoomBackendService) {}

  public loadAll(): void {
    this.backendService.getAll().pipe(untilDestroyed(this)).subscribe({
      next: (rooms) => this._rooms.next(rooms),
      error: (err) => console.error('Failed to load rooms', err)
    });
  }

  public loadAllForAdmin(): void {
    this.backendService.getAllForAdmin().pipe(untilDestroyed(this)).subscribe({
      next: (rooms) => this._rooms.next(rooms),
      error: (err) => console.error('Failed to load rooms', err)
    });
  }

  public create(dto: CommunityRoomCreateDto): void {
    this.backendService.create(dto).pipe(untilDestroyed(this)).subscribe({
      next: () => this.loadAllForAdmin(),
      error: (err) => console.error('Failed to create room', err)
    });
  }

  public update(id: string, dto: CommunityRoomUpdateDto): void {
    this.backendService.update(id, dto).pipe(untilDestroyed(this)).subscribe({
      next: () => this.loadAllForAdmin(),
      error: (err) => console.error('Failed to update room', err)
    });
  }

  public delete(id: string): void {
    this.backendService.delete(id).pipe(untilDestroyed(this)).subscribe({
      next: () => this.loadAllForAdmin(),
      error: (err) => console.error('Failed to delete room', err)
    });
  }
}
