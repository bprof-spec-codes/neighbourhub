import { Injectable } from '@angular/core';
import { ProfilListViewDto } from '../entities/dtos/profil-list-view-dto';
import { ProfilebackendService } from '../backend/profile-backend.service';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { RegisterApproveDto } from '../entities/dtos/register-approve-dto';

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

  onApprove(userId: string, role: string) {
    this.profileBackendService.approveUser(userId, role).subscribe({
      next: (res: RegisterApproveDto) => { // Típus megadva (res: any helyett)
        console.log('Approval granted:', res);
        this.loadAllPendingUsers(); // Saját metódus hívása a frissítéshez
      },
      error: (err: any) => { // Típus megadva
        console.error('Error occurred:', err);
        alert('Error occurred during approval!');
      }
    });
}
}
