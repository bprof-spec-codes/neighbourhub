import { Injectable } from '@angular/core';
import { AnnouncementBackendService } from '../backend/announcement-backend.service';
import { BehaviorSubject } from 'rxjs';
import { Announcement } from '../entities/models/announcement.model';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Injectable({
  providedIn: 'root'
})
export class AnnouncementService {
  private announcements = new BehaviorSubject<Announcement[]>([]);
  public announcements$ = this.announcements.asObservable();

  constructor(private announcementBackendService: AnnouncementBackendService) {}

  public loadAnnouncements(): void {
    this.announcementBackendService.getAnnouncements().pipe(untilDestroyed(this)).subscribe({
      next: (announcements) => {
        this.announcements.next(announcements);
      },
      error: (err) => console.error('Failed to load announcements', err)
    });
  }

  public deleteAnnouncement(id: string): void {
    this.announcementBackendService.deleteAnnouncementById(id).pipe(untilDestroyed(this)).subscribe({
      next: () => {
        this.loadAnnouncements();
      },
      error: (err) => console.error('Failed to delete announcement', err)
    });
  }
}
