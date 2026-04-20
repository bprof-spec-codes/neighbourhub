import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MessageService } from '../../services/message.service';
import { IncomingMessageDto } from '../../entities/dtos/incoming-message-dto.model';
import { SentMessageDto } from '../../entities/dtos/sent-message-dto.model';
import { CreateMessageDto } from '../../entities/dtos/create-message-dto.model';
import { UntilDestroy } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-messaging',
  standalone: false,
  templateUrl: './messaging.component.html',
  styleUrl: './messaging.component.scss'
})
export class MessagingComponent implements OnInit {
  protected incomingMessages$ = new Observable<IncomingMessageDto[]>();
  protected sentMessages$ = new Observable<SentMessageDto[]>();

  protected activeTab: 'incoming' | 'sent' = 'incoming';
  protected isComposeModalOpen = false;
  protected selectedMessage: IncomingMessageDto | null = null;
  protected isViewModalOpen = false;

  constructor(private messageService: MessageService) {}

  public ngOnInit(): void {
    this.messageService.loadIncoming();
    this.messageService.loadSent();
    this.incomingMessages$ = this.messageService.incomingMessages$;
    this.sentMessages$ = this.messageService.sentMessages$;
  }

  protected switchTab(tab: 'incoming' | 'sent'): void {
    this.activeTab = tab;
  }

  protected openComposeModal(replyTo?: IncomingMessageDto): void {
    this.selectedMessage = replyTo ?? null;
    setTimeout(() => {
    this.isComposeModalOpen = true;
  });
  }

  protected closeComposeModal(): void {
    this.isComposeModalOpen = false;
    this.selectedMessage = null;
  }

  protected sendMessage(dto: CreateMessageDto): void {
    this.messageService.sendMessage(dto, () => this.closeComposeModal());
  }

  protected markAsRead(id: string): void {
    this.messageService.markAsRead(id);
  }

  protected openViewModal(message: IncomingMessageDto): void {
  this.selectedMessage = message;
  this.isViewModalOpen = true;
  if (!message.isRead) {
    this.markAsRead(message.id);
  }
  }

  protected closeViewModal(): void {
  this.isViewModalOpen = false;
  this.selectedMessage = null;
  }

  protected replyToSelected(): void {
  const message = this.selectedMessage;
  this.closeViewModal();
  if (message) {
    this.openComposeModal(message);
  }
}
}
