import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProfilListViewDto } from '../entities/dtos/profil-list-view-dto';

@Injectable({
  providedIn: 'root'
})
export class ProfilebackendService {
  private baseApiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  loadAllPendingUsers(): Observable<ProfilListViewDto[]> {
      return this.http.get<ProfilListViewDto[]>(`${this.baseApiUrl}/User/PendingUsers`);
    }
  
}
