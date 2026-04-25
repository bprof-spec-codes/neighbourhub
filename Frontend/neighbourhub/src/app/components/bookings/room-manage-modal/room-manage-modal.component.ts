import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CommunityRoom } from '../../../entities/models/community-room.model';
import { CommunityRoomCreateDto } from '../../../entities/dtos/community-room-create-dto.model';
import { CommunityRoomUpdateDto } from '../../../entities/dtos/community-room-update-dto.model';

@Component({
  selector: 'app-room-manage-modal',
  standalone: false,
  templateUrl: './room-manage-modal.component.html',
  styleUrl: './room-manage-modal.component.scss'
})
export class RoomManageModalComponent implements OnChanges {
  @Input() isOpen = false;
  @Input() room: CommunityRoom | null = null;

  @Output() save = new EventEmitter<{ id: string | null; dto: CommunityRoomCreateDto | CommunityRoomUpdateDto }>();
  @Output() close = new EventEmitter<void>();

  protected readonly form;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.nonNullable.group({
      name: ['', Validators.required],
      description: [''],
      capacity: [1, [Validators.required, Validators.min(1)]]
    });
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen']?.currentValue === true) {
      if (this.room) {
        this.form.setValue({
          name: this.room.name,
          description: this.room.description,
          capacity: this.room.capacity
        });
      } else {
        this.form.reset({ capacity: 1 });
      }
      this.form.markAsUntouched();
    }
  }

  protected get isEditMode(): boolean {
    return this.room !== null;
  }

  protected onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const v = this.form.getRawValue();

    if (this.isEditMode && this.room) {
      this.save.emit({
        id: this.room.id,
        dto: new CommunityRoomUpdateDto(v.name, v.description, v.capacity, this.room.isActive)
      });
    } else {
      this.save.emit({
        id: null,
        dto: new CommunityRoomCreateDto(v.name, v.description, v.capacity)
      });
    }
  }

  protected onClose(): void {
    this.close.emit();
  }

  protected isInvalid(field: string): boolean {
    const control = this.form.get(field);
    return !!control && control.touched && control.invalid;
  }
}
