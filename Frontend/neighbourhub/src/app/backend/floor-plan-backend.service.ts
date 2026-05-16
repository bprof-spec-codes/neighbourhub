import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { FloorPlan } from '../entities/models/floor-plan.model';

@Injectable({
  providedIn: 'root'
})
export class FloorPlanBackendService {
  private baseApiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  public getFloorPlans(): Observable<FloorPlan[]> {
    return this.http.get<FloorPlan[]>(`${this.baseApiUrl}/FloorPlan`);
  }

  public getFloorPlanImage(floorPlanId: string): Observable<Blob> {
    return this.http.get(`${this.baseApiUrl}/FloorPlan/${floorPlanId}/image`, {
      responseType: 'blob'
    });
  }

  public uploadFloorPlan(floor: number, image: File): Observable<void> {
    const formData = new FormData();
    formData.append('Floor', floor.toString());
    formData.append('Image', image);

    return this.http.post<void>(`${this.baseApiUrl}/FloorPlan`, formData);
  }

  public addPinPoint(dto: { latitude: number; longitude: number; title: string; floorPlanId: string }): Observable<void> {
    return this.http.post<void>(`${this.baseApiUrl}/FloorPlan/addPinPoint`, dto);
  }

  public deletePinPoint(pinPointId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseApiUrl}/FloorPlan/${pinPointId}`);
  }
}