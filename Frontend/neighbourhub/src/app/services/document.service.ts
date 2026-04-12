import { Injectable } from '@angular/core';
import { DocumentsBackendService } from '../backend/documents-backend.service';
import { BehaviorSubject } from 'rxjs';
import { DocumentShortViewDto } from '../entities/dtos/document-short-view-dto.model';
@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private _documents = new BehaviorSubject<DocumentShortViewDto[]>([]);
  public documents$ = this._documents.asObservable();


  constructor(private documentBackendService: DocumentsBackendService) { }

  public loadDocuments(): void {
    this.fetchDocuments();
  }

  private fetchDocuments(): void {
    this.documentBackendService.getDocuments().subscribe({
      next: (documents) => {
        this._documents.next(documents);
      },
      error: (err) => {
        console.error('Failed to load documents', err);
      }
    });
  }
}
