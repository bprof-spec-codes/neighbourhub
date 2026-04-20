import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IncomingMessageDto } from '../../../entities/dtos/incoming-message-dto.model';
import { SentMessageDto } from '../../../entities/dtos/sent-message-dto.model';

@Component({
  selector: 'app-message-view-modal',
  standalone: false,
  templateUrl: './message-view-modal.component.html',
  styleUrl: './message-view-modal.component.scss'
})
export class MessageViewModalComponent {
  @Input() isOpen = false;
  @Input() message: IncomingMessageDto | null = null;
  @Input() sentMessage: SentMessageDto | null = null

  @Output() reply = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();

  protected onReply(): void {
    this.reply.emit();
  }

  protected onClose(): void {
    this.close.emit();
  }

  protected get displayMessage() {
    return this.message ?? this.sentMessage;
  }

  protected get isReplyable(): boolean {
    return this.message !== null;
  }

}
