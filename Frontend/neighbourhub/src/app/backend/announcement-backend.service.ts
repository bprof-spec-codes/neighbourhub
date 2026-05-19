import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Announcement } from '../entities/models/announcement.model';
import { AnnouncementCategory } from '../entities/enums/announcement-category.model';
import { AnnouncementAddDto } from '../entities/dtos/announcement-add-dto.model';

@Injectable({
  providedIn: 'root'
})
export class AnnouncementBackendService {
  private baseApiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  public getAnnouncements(): Observable<Announcement[]> {
    return this.http.get<Announcement[]>(`${this.baseApiUrl}/Announcement`);
  }

  public deleteAnnouncementById(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseApiUrl}/Announcement/${id}`);
  }

  public addAnnouncement(announcementToAdd: AnnouncementAddDto): Observable<Announcement> {
    return this.http.post<Announcement>(`${this.baseApiUrl}/Announcement`, announcementToAdd);
  }

  public getCarouselAnnouncements(): Observable<Announcement[]> {
    return this.http.get<Announcement[]>(`${this.baseApiUrl}/Announcement/carousel`);
  }
}
