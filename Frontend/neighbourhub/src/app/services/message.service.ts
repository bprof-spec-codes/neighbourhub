import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IncomingMessageDto } from '../entities/dtos/incoming-message-dto.model';
import { SentMessageDto } from '../entities/dtos/sent-message-dto.model';
import { MessageBackendService } from '../backend/message-backend.service';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { CreateMessageDto } from '../entities/dtos/create-message-dto.model';

@UntilDestroy()
@Injectable({
  providedIn: 'root'
})
export class MessageService {

  private incomingMessages = new BehaviorSubject<IncomingMessageDto[]>([])
  public incomingMessages$ = this.incomingMessages.asObservable()

  private sentMessages = new BehaviorSubject<SentMessageDto[]>([])
  public sentMessages$ = this.sentMessages.asObservable()

  constructor(private messageBackendService: MessageBackendService) { }

  public loadIncoming(): void{
    this.messageBackendService.getIncoming().pipe(untilDestroyed(this)).subscribe({
      next: (messages) => this.incomingMessages.next(messages),
      error: (err) => console.error("Failed to load incoming messages", err)
    })
  }

  public loadSent(): void{
    this.messageBackendService.getSent().pipe(untilDestroyed(this)).subscribe({
      next: (messages) => this.sentMessages.next(messages),
      error: (err) => console.error('Failed to load sent messages', err)
    })
  }

  public sendMessage(dto: CreateMessageDto, onSuccess?: () => void, onError?: (err: unknown) => void): void {
    this.messageBackendService.sendMessage(dto).pipe(untilDestroyed(this)).subscribe({
      next: () => {
        this.loadSent();
        onSuccess?.();
      },
      error: (err) => {
        console.error('Failed to send message', err);
        onError?.(err);
      }
    });
  }

  public markAsRead(id: string): void {
    this.messageBackendService.markAsRead(id).pipe(untilDestroyed(this)).subscribe({
      next: () => this.loadIncoming(),
      error: (err) => console.error('Failed to mark message as read', err)
    });
  }

  public deleteMessage(id: string, isSent: boolean): void {
  this.messageBackendService.deleteMessage(id).pipe(untilDestroyed(this)).subscribe({
    next: () => {
      if (isSent) {
        this.loadSent();
      } else {
        this.loadIncoming();
      }
    },
    error: (err) => console.error('Failed to delete message', err)
  });
}
}
