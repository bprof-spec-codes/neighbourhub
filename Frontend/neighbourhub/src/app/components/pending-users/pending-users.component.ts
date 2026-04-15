import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../../services/profile.service';
import { Observable } from 'rxjs/internal/Observable';

@Component({
  selector: 'app-pending-users',
  standalone: false,
  templateUrl: './pending-users.component.html',
  styleUrl: './pending-users.component.scss'
})
export class PendingUsersComponent implements OnInit {
constructor(public profileService: ProfileService) {}

  ngOnInit(): void {
    // Profilok betöltése induláskor
    this.profileService.loadAllPendingUsers();
  }

  onApprove(userId: string | undefined, role: string | undefined) {
    if (!userId || !role) return;
    this.profileService.onApprove(userId, role);
  }
  

  onReject(userId: string | undefined){
    return this.profileService.onReject(userId);
  }
}
