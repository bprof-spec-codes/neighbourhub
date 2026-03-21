import { Component, OnInit } from '@angular/core';
import { AnnouncementService } from '../../services/announcement.service';
import { Observable } from 'rxjs';
import { Announcement } from '../../entities/models/announcement.model';
import { AnnouncementCategory } from '../../entities/enums/announcement-category.model';

@Component({
  selector: 'app-announcement-list',
  standalone: false,
  templateUrl: './announcement-list.component.html',
  styleUrl: './announcement-list.component.scss'
})
export class AnnouncementListComponent implements OnInit {
  protected announcements$ = new Observable<Announcement[]>();

  constructor(private announcementService: AnnouncementService) { }

  public ngOnInit(): void {
    this.loadAnnouncements();
  }

  private loadAnnouncements(): void {
    this.announcementService.loadAnnouncements();
    this.announcements$ = this.announcementService.announcements$;
  }

  protected addAnnouncement(): void {
    alert('Add Announcement functionality is not implemented yet.');
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
      case 'maintenance':
        return 'badge-maintenance';
      case 'event':
        return 'badge-event';
      case 'policy':
        return 'badge-policy';
      default:
        return 'badge-general';
    }
  }

  protected getCategoryCardClass(category: Announcement['category']): string {
    const categoryText = this.getCategoryText(category).toLowerCase();

    switch (categoryText) {
      case 'maintenance':
        return 'category-maintenance';
      case 'event':
        return 'category-event';
      case 'policy':
        return 'category-policy';
      default:
        return 'category-general';
    }
  }
}
