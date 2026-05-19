import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { DashboardData } from '../entities/dtos/dashboard-data';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DashboardBackendService {
private baseApiUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }
  public getStats(): Observable<DashboardData> {
      return this.http.get<DashboardData>(`${this.baseApiUrl}/Dashboard`);
    }
}
