import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DocumentShortViewDto } from '../entities/dtos/document-short-view-dto.model';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class DocumentsBackendService {
  private baseApiUrl = environment.apiUrl;


  constructor(private http: HttpClient) { }

  public getDocuments(): Observable<DocumentShortViewDto[]> {
    return this.http.get<DocumentShortViewDto[]>(this.baseApiUrl + '/document');
  }
}
