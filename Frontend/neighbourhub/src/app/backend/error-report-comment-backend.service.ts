import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { ErrorReportCommentListItem } from '../entities/models/error-report-comment.model';
import { ErrorReportCommentCreateDto } from '../entities/dtos/error-report-comment-create-dto.model';

@Injectable({
  providedIn: 'root'
})
export class ErrorReportCommentBackendService {
  private baseApiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  public getByErrorReport(errorReportId: string): Observable<ErrorReportCommentListItem[]> {
    return this.http.get<ErrorReportCommentListItem[]>(`${this.baseApiUrl}/ErrorReport/${errorReportId}/comments`);
  }

  public add(errorReportId: string, dto: ErrorReportCommentCreateDto): Observable<void> {
    return this.http.post<void>(`${this.baseApiUrl}/ErrorReport/${errorReportId}/comments`, dto);
  }

  public delete(errorReportId: string, commentId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseApiUrl}/ErrorReport/${errorReportId}/comments/${commentId}`);
  }
}
