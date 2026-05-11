import { Injectable } from '@angular/core';
import { AnnouncementBackendService } from '../backend/announcement-backend.service';
import { BehaviorSubject } from 'rxjs';
import { Announcement } from '../entities/models/announcement.model';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { AnnouncementAddDto } from '../entities/dtos/announcement-add-dto.model';

@UntilDestroy()
@Injectable({
  providedIn: 'root'
})
export class AnnouncementService {
  private announcements = new BehaviorSubject<Announcement[]>([]);
  public announcements$ = this.announcements.asObservable();

  private carouselAnnouncements = new BehaviorSubject<Announcement[]>([]);
  public carouselAnnouncements$ = this.carouselAnnouncements.asObservable();
  

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

  public addAnnouncement(announcementToAdd: AnnouncementAddDto): void {
    this.announcementBackendService.addAnnouncement(announcementToAdd).pipe(untilDestroyed(this)).subscribe({
      next: () => {
        this.loadAnnouncements();
      },
      error: (err) => console.error('Failed to create announcement', err)
    });
  }

  public loadCarouselAnnouncements(): void {
    this.announcementBackendService.getCarouselAnnouncements().pipe(untilDestroyed(this)).subscribe({
        next: (announcements) => {
            this.carouselAnnouncements.next(announcements);
        },
        error: (err) => console.error('Failed to load carousel announcements', err)
    });
  }
}
