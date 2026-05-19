import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ResidentService } from '../../services/resident.service';
import { Resident } from '../../entities/models/resident.model';

type NavItem = {
  label: string;
  route: string;
  iconClass: string;
  exact?: boolean;
};

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {
  @Input() collapsed = false;
  @Output() collapsedChange = new EventEmitter<boolean>();
  @ViewChild('profileImageInput') profileImageInput?: ElementRef<HTMLInputElement>;

  protected profileCardOpen = false;
  protected isProfileImageUploading = false;
  protected currentResident: Resident | null = null;

  constructor(
    private authService: AuthService,
    private residentService: ResidentService
  ) {}

  readonly navItems: NavItem[] = [
    { label: 'Dashboard', route: '/dashboard', iconClass: 'bi bi-grid-1x2-fill', exact: true },
    { label: 'Voting', route: '/voting', iconClass: 'bi bi-check2-square' },
    { label: 'Issues', route: '/issues', iconClass: 'bi bi-exclamation-triangle-fill' },
    { label: 'Announcements', route: '/announcements', iconClass: 'bi bi-megaphone-fill' },
    { label: 'Bookings', route: '/bookings', iconClass: 'bi bi-calendar-week-fill' },
    { label: 'Floor Plans', route: '/floor-plans', iconClass: 'bi bi-map-fill' },
    { label: 'Residents', route: '/residents', iconClass: 'bi bi-people-fill' },
    { label: 'Documents', route: '/documents', iconClass: 'bi bi-file-earmark-text-fill' },
    { label: 'Messages', route: '/messaging', iconClass: 'bi bi-envelope-fill' }
  ];
  
  toggleSidebar(): void {
    this.collapsed = !this.collapsed;
    this.collapsedChange.emit(this.collapsed);
  }

  ngOnInit(): void {
    this.loadCurrentResident();
  }

  toggleProfileCard(): void {
    this.profileCardOpen = !this.profileCardOpen;
  }

  closeProfileCard(): void {
    this.profileCardOpen = false;
  }

  protected get currentUserId(): string | null {
    return this.authService.getUserId();
  }

  protected get profileName(): string {
    if (!this.currentResident) {
      return 'Profile';
    }

    return `${this.currentResident.firstName} ${this.currentResident.lastName}`.trim();
  }

  protected get profileSubtitle(): string {
    if (!this.currentResident) {
      return 'Loading your details...';
    }

    const apartment = this.currentResident.apartmentNumber.length > 0
      ? `${this.currentResident.apartmentNumber.join(', ')}`
      : 'No apartment assigned';

    return apartment;
  }

  protected get profileEmail(): string {
    return this.currentResident?.email ?? '';
  }

  protected get profilePhoneNumber(): string {
    return this.currentResident?.phoneNumber ?? '';
  }

  protected getProfileAvatarUrl(): string | null {
    return this.getResidentProfileImageUrl(this.currentResident?.profileImagePath ?? null);
  }

  protected getResidentInitial(firstName: string, lastName: string): string {
    const fullName = `${firstName} ${lastName}`.trim();
    return fullName.charAt(0).toUpperCase();
  }

  protected onAvatarClick(): void {
    this.profileImageInput?.nativeElement.click();
  }

  protected onProfileImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;

    if (!file || !this.currentUserId) {
      return;
    }

    this.isProfileImageUploading = true;

    this.residentService.uploadResidentProfileImage(
      this.currentUserId,
      file,
      (profileImagePath) => {
        this.isProfileImageUploading = false;
        if (this.currentResident) {
          this.currentResident = { ...this.currentResident, profileImagePath };
        }
        input.value = '';
      },
      () => {
        this.isProfileImageUploading = false;
        input.value = '';
      }
    );
  }

  protected getResidentProfileImageUrl(profileImagePath: string | null): string | null {
    if (!profileImagePath || profileImagePath.trim().length === 0) {
      return null;
    }

    if (profileImagePath.startsWith('http://') || profileImagePath.startsWith('https://')) {
      return profileImagePath;
    }

    return this.residentService.resolveApiUrl(profileImagePath);
  }

  private loadCurrentResident(): void {
    const userId = this.currentUserId;
    if (!userId) {
      return;
    }

    this.residentService.getResidentById(userId).subscribe({
      next: (resident) => {
        this.currentResident = resident;
      },
      error: (error) => {
        console.error('Failed to load current resident profile', error);
      }
    });
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }
  onLogout(): void {
    this.authService.logout();
  }
}
