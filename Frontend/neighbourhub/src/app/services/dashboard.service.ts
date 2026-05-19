import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DashboardData } from '../entities/dtos/dashboard-data';
import { DashboardBackendService } from '../backend/dashboard-backend.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
private apiUrl = 'https://localhost:xxxx/api/dashboard'; 

  constructor(private dashboardservicebackend:DashboardBackendService) { }

  getStats(): Observable<DashboardData> {
    return this.dashboardservicebackend.getStats();
  }
}
