import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Resident } from '../entities/models/resident.model';
import { AdminUpdateResidentDto } from '../entities/dtos/admin-update-resident-dto.model';

@Injectable({
  providedIn: 'root'
})
export class ResidentBackendService {
  private baseApiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  public getResidents(): Observable<Resident[]> {
    return this.http.get<Resident[]>(`${this.baseApiUrl}/User/Residents`);
  }

  public getResidentById(id: string): Observable<Resident> {
    return this.http.get<Resident>(`${this.baseApiUrl}/User/Residents/${id}`);
  }

  public updateResident(id: string, resident: AdminUpdateResidentDto): Observable<void> {
    return this.http.put<void>(`${this.baseApiUrl}/User/Residents/${id}`, resident);
  }

  public uploadResidentProfileImage(id: string, file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http
      .post<{ profileImagePath: string }>(`${this.baseApiUrl}/User/Residents/${id}/profile-image`, formData)
      .pipe(map((response) => response.profileImagePath));
  }

  public fetchProfileImageBlobUrl(id: string): Observable<string> {
    return this.http.get(`${this.baseApiUrl}/User/Residents/${id}/profile-image`, {
      responseType: 'blob'
    }).pipe(map(blob => URL.createObjectURL(blob)));
  }

  public resolveApiUrl(path: string): string {
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }

    const apiOrigin = this.baseApiUrl.replace(/\/api\/?$/, '');
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return `${apiOrigin}${normalizedPath}`;
  }
}
