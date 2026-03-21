import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Announcement } from '../entities/models/announcement.model';

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
}
