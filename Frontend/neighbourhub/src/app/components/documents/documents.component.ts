import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DocumentShortViewDto } from '../../entities/dtos/document-short-view-dto.model';
import { DocumentService } from '../../services/document.service';
import { DocumentAddDto } from '../../entities/dtos/document-add-dto.model';

@Component({
  selector: 'app-documents',
  standalone: false,
  templateUrl: './documents.component.html',
  styleUrl: './documents.component.scss'
})
export class DocumentsComponent implements OnInit {
  protected documents$ = new Observable<DocumentShortViewDto[]>();
  protected searchTerm = '';
  protected isAddModalOpen = false;

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

  protected onDeleteDocument(documentId: string): void {
    this.documentService.deleteDocument(documentId);
  }

  protected openAddModal(): void {
    this.isAddModalOpen = true;
  }

  protected closeAddModal(): void {
    this.isAddModalOpen = false;
  }

  protected addDocument(documentAddDto: DocumentAddDto): void {
    this.documentService.addDocument(documentAddDto);
    this.closeAddModal();
  }
}
