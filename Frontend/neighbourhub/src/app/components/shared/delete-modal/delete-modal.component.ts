import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-delete-modal',
  standalone: false,
  templateUrl: './delete-modal.component.html',
  styleUrl: './delete-modal.component.scss'
})
export class DeleteModalComponent {
  @Input() isOpen = false;
  @Input() content = '';

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  public onBackdropClick(): void {
    this.cancel.emit();
  }

  public onCancel(): void {
    this.cancel.emit();
  }

  public onConfirm(): void {
    this.confirm.emit();
  }
}
