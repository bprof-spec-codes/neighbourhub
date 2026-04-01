import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
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

  public updateResident(id: string, resident: AdminUpdateResidentDto): Observable<void> {
    return this.http.put<void>(`${this.baseApiUrl}/User/Residents/${id}`, resident);
  }
}
