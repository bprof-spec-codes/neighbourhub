import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DocumentShortViewDto } from '../../entities/dtos/document-short-view-dto.model';
import { DocumentService } from '../../services/document.service';

@Component({
  selector: 'app-documents',
  standalone: false,
  templateUrl: './documents.component.html',
  styleUrl: './documents.component.scss'
})
export class DocumentsComponent implements OnInit {
  protected documents$ = new Observable<DocumentShortViewDto[]>();
  protected searchTerm = '';

  constructor(private documentService: DocumentService) { }

  ngOnInit(): void {
    this.documentService.loadDocuments();
    this.documents$ = this.documentService.documents$;
  }

  protected getFilteredDocuments(documents: DocumentShortViewDto[] | null): DocumentShortViewDto[] {
    if (!documents) {
      return [];
    }

    const normalizedSearchTerm = this.searchTerm.trim().toLowerCase();

    if (!normalizedSearchTerm) {
      return documents;
    }

    return documents.filter((document) =>
      document.title.toLowerCase().includes(normalizedSearchTerm)
    );
  }

  protected onDownloadDocument(documentId: string): void {
    this.documentService.downloadDocument(documentId);
  }
}
