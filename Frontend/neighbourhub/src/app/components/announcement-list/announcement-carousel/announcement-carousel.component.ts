import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Announcement } from '../../../entities/models/announcement.model';
import { AnnouncementService } from '../../../services/announcement.service';
import { AnnouncementCategory } from '../../../entities/enums/announcement-category.model';

@UntilDestroy()
@Component({
  selector: 'app-announcement-carousel',
  standalone: false,
  templateUrl: './announcement-carousel.component.html',
  styleUrl: './announcement-carousel.component.scss'
})
export class AnnouncementCarouselComponent implements OnInit, OnDestroy {

  protected announcements: Announcement[] = [];
  protected currentIndex = 0;

  private intervalId: any;
  private refreshId: any;

  constructor(private announcementService: AnnouncementService) {}

  public ngOnInit(): void {
    this.announcementService.loadCarouselAnnouncements();
    this.announcementService.carouselAnnouncements$.pipe(untilDestroyed(this)).subscribe({
      next: (announcements) => {
        this.announcements = announcements;
        if (this.currentIndex >= announcements.length) {
          this.currentIndex = 0;
        }
      }
    });

    this.intervalId = setInterval(() => this.nextSlide(), 7500);
    this.refreshId = setInterval(() => this.announcementService.loadCarouselAnnouncements(), 60000);
  }

  public ngOnDestroy(): void {
    clearInterval(this.intervalId);
    clearInterval(this.refreshId);
  }

  protected nextSlide(): void {
    if (this.announcements.length === 0) return;
    this.currentIndex = (this.currentIndex + 1) % this.announcements.length;
  }

  protected get currentAnnouncement(): Announcement | null {
    return this.announcements[this.currentIndex] ?? null;
  }

  protected getCategoryText(category: Announcement['category']): string {
    if (typeof category === 'number') {
      return AnnouncementCategory[category] ?? 'General';
    }
    return String(category);
  }

  protected getCategoryBadgeClass(category: Announcement['category']): string {
    const categoryText = this.getCategoryText(category).toLowerCase();
    switch (categoryText) {
      case 'maintenance': return 'badge-maintenance';
      case 'event': return 'badge-event';
      case 'policy': return 'badge-policy';
      default: return 'badge-general';
    }
  }

  protected getCategoryCardClass(category: Announcement['category']): string {
    const categoryText = this.getCategoryText(category).toLowerCase();
    switch (categoryText) {
      case 'maintenance': return 'category-maintenance';
      case 'event': return 'category-event';
      case 'policy': return 'category-policy';
      default: return 'category-general';
    }
  }
}
