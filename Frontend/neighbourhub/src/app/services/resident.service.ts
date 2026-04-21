import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Resident } from '../entities/models/resident.model';
import { ResidentBackendService } from '../backend/resident-backend.service';
import { AdminUpdateResidentDto } from '../entities/dtos/admin-update-resident-dto.model';

@UntilDestroy()
@Injectable({
  providedIn: 'root'
})
export class ResidentService {
  private residents = new BehaviorSubject<Resident[]>([]);
  public residents$ = this.residents.asObservable();

  constructor(private residentBackendService: ResidentBackendService) {}

  public loadResidents(): void {
    this.residentBackendService.getResidents().pipe(untilDestroyed(this)).subscribe({
      next: (residents) => this.residents.next(residents),
      error: (err) => console.error('Failed to load residents', err)
    });
  }

  public updateResident(
    id: string,
    resident: AdminUpdateResidentDto,
    onSuccess?: () => void,
    onError?: (err: unknown) => void
  ): void {
    this.residentBackendService.updateResident(id, resident).pipe(untilDestroyed(this)).subscribe({
      next: () => {
        this.loadResidents();
        onSuccess?.();
      },
      error: (err) => {
        console.error('Failed to update resident', err);
        onError?.(err);
      }
    });
  }

  public uploadResidentProfileImage(
    id: string,
    file: File,
    onSuccess?: (profileImagePath: string) => void,
    onError?: (err: unknown) => void
  ): void {
    this.residentBackendService.uploadResidentProfileImage(id, file).pipe(untilDestroyed(this)).subscribe({
      next: (profileImagePath) => onSuccess?.(profileImagePath),
      error: (err) => {
        console.error('Failed to upload resident profile image', err);
        onError?.(err);
      }
    });
  }

  public resolveApiUrl(path: string): string {
    return this.residentBackendService.resolveApiUrl(path);
  }
}
