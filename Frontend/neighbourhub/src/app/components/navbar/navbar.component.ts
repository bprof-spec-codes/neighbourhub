import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
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
  imports: [CommonModule, RouterModule, TranslateModule],
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
  protected profileImageBlobUrl: string | null = null;
  protected currentLang = 'en';
  protected langMenuOpen = false;

  constructor(
    private authService: AuthService,
    private residentService: ResidentService,
    private translate: TranslateService
  ) {}

  readonly navItems: NavItem[] = [
    { label: 'NAVBAR.NAV_ITEMS.DASHBOARD', route: '/dashboard', iconClass: 'bi bi-grid-1x2-fill', exact: true },
    { label: 'NAVBAR.NAV_ITEMS.VOTING', route: '/voting', iconClass: 'bi bi-check2-square' },
    { label: 'NAVBAR.NAV_ITEMS.ISSUES', route: '/issues', iconClass: 'bi bi-exclamation-triangle-fill' },
    { label: 'NAVBAR.NAV_ITEMS.ANNOUNCEMENTS', route: '/announcements', iconClass: 'bi bi-megaphone-fill' },
    { label: 'NAVBAR.NAV_ITEMS.BOOKINGS', route: '/bookings', iconClass: 'bi bi-calendar-week-fill' },
    { label: 'NAVBAR.NAV_ITEMS.FLOOR_PLANS', route: '/floor-plans', iconClass: 'bi bi-map-fill' },
    { label: 'NAVBAR.NAV_ITEMS.RESIDENTS', route: '/residents', iconClass: 'bi bi-people-fill' },
    { label: 'NAVBAR.NAV_ITEMS.DOCUMENTS', route: '/documents', iconClass: 'bi bi-file-earmark-text-fill' },
    { label: 'NAVBAR.NAV_ITEMS.MESSAGES', route: '/messaging', iconClass: 'bi bi-envelope-fill' }
  ];
  
  toggleSidebar(): void {
    this.collapsed = !this.collapsed;
    this.collapsedChange.emit(this.collapsed);
  }

  ngOnInit(): void {
    const saved = localStorage.getItem('lang');
    const browserLang = this.translate.getBrowserLang();
    const lang = saved ?? (browserLang && ['en','hu'].includes(browserLang) ? browserLang : 'en');
    this.currentLang = lang;
    this.translate.use(lang);
    this.loadCurrentResident();
  }

  protected onLanguageChange(event: Event): void {
    const target = event.target as HTMLSelectElement | null;
    const selectedLang = target?.value;

    if (!selectedLang || !['en', 'hu'].includes(selectedLang)) {
      return;
    }

    this.currentLang = selectedLang;
    this.translate.use(selectedLang);
    localStorage.setItem('lang', selectedLang);
  }

  protected toggleLangMenu(): void {
    this.langMenuOpen = !this.langMenuOpen;
  }

  protected selectLanguage(lang: string): void {
    if (!['en', 'hu'].includes(lang)) return;
    this.currentLang = lang;
    this.translate.use(lang);
    localStorage.setItem('lang', lang);
    this.langMenuOpen = false;
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
      return this.translate.instant('NAVBAR.NAV_ITEMS.PROFILE');
    }

    return `${this.currentResident.firstName} ${this.currentResident.lastName}`.trim();
  }

  protected get profileSubtitle(): string {
    if (!this.currentResident) {
      return this.translate.instant('NAVBAR.NAV_ITEMS.LOADING_PROFILE');
    }

    const apartment = this.currentResident.apartmentNumber.length > 0
      ? `${this.currentResident.apartmentNumber.join(', ')}`
      : this.translate.instant('NAVBAR.NO_APARTMENT');

    return apartment;
  }

  protected get profileEmail(): string {
    return this.currentResident?.email ?? '';
  }

  protected get profilePhoneNumber(): string {
    return this.currentResident?.phoneNumber ?? '';
  }

  protected getProfileAvatarUrl(): string | null {
    return this.profileImageBlobUrl;
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
        this.residentService.fetchProfileImageBlobUrl(this.currentUserId!).subscribe({
          next: (url) => { this.profileImageBlobUrl = url; },
          error: () => {}
        });
        input.value = '';
      },
      () => {
        this.isProfileImageUploading = false;
        input.value = '';
      }
    );
  }

  private loadCurrentResident(): void {
    const userId = this.currentUserId;
    if (!userId) {
      return;
    }

    this.residentService.getResidentById(userId).subscribe({
      next: (resident) => {
        this.currentResident = resident;
        if (resident.profileImagePath) {
          this.residentService.fetchProfileImageBlobUrl(userId).subscribe({
            next: (url) => { this.profileImageBlobUrl = url; },
            error: () => { this.profileImageBlobUrl = null; }
          });
        }
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
