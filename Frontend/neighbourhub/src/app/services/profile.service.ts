import { Injectable } from '@angular/core';
import { ProfilListViewDto } from '../entities/dtos/profil-list-view-dto';
import { ProfilebackendService } from '../backend/profile-backend.service';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  
    private profileShortSubject = new BehaviorSubject<ProfilListViewDto[]>([])
    public profilessShort$ = this.profileShortSubject.asObservable()

  constructor(private profileBackendService: ProfilebackendService) 
  { }

  public loadAllPendingUsers(): void {
      this.profileBackendService.loadAllPendingUsers().pipe(untilDestroyed(this)).subscribe({
        next: (profiles) => {
          this.profileShortSubject.next(profiles);
        },
        error: (err) => console.error('Failed to load pending users', err)
      });
    }
}
