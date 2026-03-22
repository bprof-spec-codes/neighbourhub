import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { ErrorReportListItem, ErrorReportDetail, ErrorReportSummary } from '../entities/models/error-report.model';
import { ErrorReportCreateDto } from '../entities/dtos/error-report-create-dto.model';
import { ErrorReportUpdateDto } from '../entities/dtos/error-report-update-dto.model';

@Injectable({
  providedIn: 'root'
})
export class ErrorReportBackendService {
  private baseApiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  public getAll(status?: string, category?: string, priority?: string): Observable<ErrorReportListItem[]> {
    let params = new HttpParams();
    if (status) params = params.set('status', status);
    if (category) params = params.set('category', category);
    if (priority) params = params.set('priority', priority);
    return this.http.get<ErrorReportListItem[]>(`${this.baseApiUrl}/ErrorReport`, { params });
  }

  public getSummary(): Observable<ErrorReportSummary> {
    return this.http.get<ErrorReportSummary>(`${this.baseApiUrl}/ErrorReport/summary`);
  }

  public getById(id: string): Observable<ErrorReportDetail> {
    return this.http.get<ErrorReportDetail>(`${this.baseApiUrl}/ErrorReport/${id}`);
  }

  public create(dto: ErrorReportCreateDto): Observable<{ id: string }> {
    return this.http.post<{ id: string }>(`${this.baseApiUrl}/ErrorReport`, dto);
  }

  public update(id: string, dto: ErrorReportUpdateDto): Observable<void> {
    return this.http.put<void>(`${this.baseApiUrl}/ErrorReport/${id}`, dto);
  }

  public delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseApiUrl}/ErrorReport/${id}`);
  }
}
