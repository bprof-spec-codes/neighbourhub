import { Component, EventEmitter, Input, Output } from '@angular/core';
import { VoteOption } from '../../../entities/enums/vote-option.model';


@Component({
  selector: 'app-vote-modal',
  standalone: false,
  templateUrl: './vote-modal.component.html',
  styleUrl: './vote-modal.component.scss'
})
export class VoteModalComponent {

  @Input() isOpen = false;
  @Output() vote = new EventEmitter<VoteOption>();
  @Output() close = new EventEmitter<void>();

  protected readonly VoteOption = VoteOption;

  protected onVote(option: VoteOption): void {
    this.vote.emit(option);
  }

  protected onClose(): void {
    this.close.emit();
  }
}
