import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { CommunityRoom } from '../entities/models/community-room.model';
import { CommunityRoomCreateDto } from '../entities/dtos/community-room-create-dto.model';
import { CommunityRoomUpdateDto } from '../entities/dtos/community-room-update-dto.model';

@Injectable({
  providedIn: 'root'
})
export class CommunityRoomBackendService {
  private baseApiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  public getAll(): Observable<CommunityRoom[]> {
    return this.http.get<CommunityRoom[]>(`${this.baseApiUrl}/CommunityRoom`);
  }

  public getAllForAdmin(): Observable<CommunityRoom[]> {
    return this.http.get<CommunityRoom[]>(`${this.baseApiUrl}/CommunityRoom/admin`);
  }

  public create(dto: CommunityRoomCreateDto): Observable<void> {
    return this.http.post<void>(`${this.baseApiUrl}/CommunityRoom`, dto);
  }

  public update(id: string, dto: CommunityRoomUpdateDto): Observable<void> {
    return this.http.put<void>(`${this.baseApiUrl}/CommunityRoom/${id}`, dto);
  }

  public delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseApiUrl}/CommunityRoom/${id}`);
  }
}
