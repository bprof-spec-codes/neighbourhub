import { Component, OnInit } from '@angular/core';
import { AnnouncementService } from '../../services/announcement.service';

@Component({
  selector: 'app-announcement-list',
  standalone: false,
  templateUrl: './announcement-list.component.html',
  styleUrl: './announcement-list.component.scss'
})
export class AnnouncementListComponent implements OnInit {

  constructor(private announcementService: AnnouncementService) { }

  public ngOnInit(): void {
    this.announcementService.loadAnnouncements();
  }
}
