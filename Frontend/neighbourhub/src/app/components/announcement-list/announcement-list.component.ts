import { Component, OnInit } from '@angular/core';
import { AnnouncementService } from '../../services/announcement.service';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { Announcement } from '../../entities/models/announcement.model';
import { AnnouncementCategory } from '../../entities/enums/announcement-category.model';
import { AnnouncementAddDto } from '../../entities/dtos/announcement-add-dto.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-announcement-list',
  standalone: false,
  templateUrl: './announcement-list.component.html',
  styleUrl: './announcement-list.component.scss'
})
export class AnnouncementListComponent implements OnInit {
  protected announcements$ = new Observable<Announcement[]>();
  protected isAddModalOpen = false;
  protected isDeleteModalOpen = false;

  private idToDelete: string = "";

  constructor(
    private announcementService: AnnouncementService,
    protected authService: AuthService,
    private translate: TranslateService
  ) { }

  public ngOnInit(): void {
    this.loadAnnouncements();
  }

  private loadAnnouncements(): void {
    this.announcementService.loadAnnouncements();
    this.announcements$ = this.announcementService.announcements$;
  }

  protected openAddModal(): void {
    this.isAddModalOpen = true;
  }

  protected closeAddModal(): void {
    this.isAddModalOpen = false;
  }

  protected addAnnouncement(formValue: AnnouncementAddDto): void {
    this.announcementService.addAnnouncement(formValue);
    this.closeAddModal();
  }

  protected openDeleteModal(id: string): void {
    this.isDeleteModalOpen = true;
    this.idToDelete = id;
  }

  protected closeDeleteModal(): void {
    this.isDeleteModalOpen = false;
  }

  protected deleteAnnouncement(): void {
    if (this.idToDelete === "") {
      console.error('No announcement ID specified for deletion.');
      return;
    }
    this.announcementService.deleteAnnouncement(this.idToDelete);
    this.closeDeleteModal();
  }

  protected getCategoryText(category: Announcement['category']): string {
    let categoryText = '';

    if (typeof category === 'number') {
      categoryText = AnnouncementCategory[category] ?? 'General';
    } else {
      categoryText = String(category);
    }

    return this.translate.instant(`ANNOUNCEMENTS.CATEGORIES.${categoryText.toUpperCase()}`);
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

  protected openDisplay(): void {
    window.open('/display', '_blank');
  }
}
