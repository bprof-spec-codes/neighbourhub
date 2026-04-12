import { Injectable } from '@angular/core';
import { DocumentsBackendService } from '../backend/documents-backend.service';
import { BehaviorSubject } from 'rxjs';
import { DocumentShortViewDto } from '../entities/dtos/document-short-view-dto.model';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@Injectable({
  providedIn: 'root'
})
@UntilDestroy()
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

  public downloadDocument(documentId: string): void {
    this.documentBackendService.downloadDocument(documentId).pipe(untilDestroyed(this)).subscribe({
      next: (response) => {
        const blob = response.body;

        if (!blob) {
          return;
        }

        const contentDisposition = response.headers.get('content-disposition');
        const fileName = this.extractFileName(contentDisposition) ?? `document-${documentId}.pdf`;

        const objectUrl = window.URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = objectUrl;
        anchor.download = fileName;
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
        window.URL.revokeObjectURL(objectUrl);
      },
      error: (err) => {
        console.error('Failed to download document', err);
      }
    });
  }

  private extractFileName(contentDisposition: string | null): string | null {
    if (!contentDisposition) {
      return null;
    }

    const utf8NameMatch = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i);
    if (utf8NameMatch?.[1]) {
      return decodeURIComponent(utf8NameMatch[1]);
    }

    const basicNameMatch = contentDisposition.match(/filename="?([^";]+)"?/i);
    return basicNameMatch?.[1] ?? null;
  }
}
