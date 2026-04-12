import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../../services/profile.service';

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

  onApprove(userId: string | undefined) {
    if (!userId) return;
    console.log('User approved:', userId);
    // Itt hívd meg a backend szervizet az elfogadáshoz
    // Példa: this.profileBackendService.approveUser(userId).subscribe(() => this.profileService.loadAllPendingUsers());
  }

  onReject(userId: string | undefined) {
    if (!userId) return;
    if (confirm('You are definitely declining the registration?')) {
      console.log('User rejected:', userId);
      // Itt hívd meg a backend szervizet az elutasításhoz
    }
  }
}
