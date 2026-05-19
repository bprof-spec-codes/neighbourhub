import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DocumentShortViewDto } from '../entities/dtos/document-short-view-dto.model';
import { environment } from '../../environments/environment.development';
import { DocumentAddDto } from '../entities/dtos/document-add-dto.model';

@Injectable({
  providedIn: 'root'
})
export class DocumentsBackendService {
  private baseApiUrl = environment.apiUrl;


  constructor(private http: HttpClient) { }

  public getDocuments(): Observable<DocumentShortViewDto[]> {
    return this.http.get<DocumentShortViewDto[]>(this.baseApiUrl + '/document');
  }

  public downloadDocument(documentId: string): Observable<HttpResponse<Blob>> {
    return this.http.get(this.baseApiUrl + `/document/${documentId}/download`, { 
      responseType: 'blob',
      observe: 'response'
    });
  }

  public addDocument(dto: DocumentAddDto): Observable<void> {
    const formData = new FormData();
    formData.append('title', dto.title);
    formData.append('file', dto.file);

    return this.http.post<void>(this.baseApiUrl + '/document', formData);
  }

  public deleteDocument(documentId: string): Observable<void> {
    return this.http.delete<void>(this.baseApiUrl + `/document/${documentId}`);
  }
}
