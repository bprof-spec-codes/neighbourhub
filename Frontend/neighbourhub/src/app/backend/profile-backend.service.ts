import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProfilListViewDto } from '../entities/dtos/profil-list-view-dto';
import { RegisterApproveDto } from '../entities/dtos/register-approve-dto';

@Injectable({
  providedIn: 'root'
})
export class ProfilebackendService {
  private baseApiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  loadAllPendingUsers(): Observable<ProfilListViewDto[]> {
      return this.http.get<ProfilListViewDto[]>(`${this.baseApiUrl}/User/PendingUsers`);
    }
  approveUser(userId: string, role: string): Observable<RegisterApproveDto> {
    return this.http.post<RegisterApproveDto>(`${this.baseApiUrl}/User/ApproveUser`, { userId, role });
}
}
