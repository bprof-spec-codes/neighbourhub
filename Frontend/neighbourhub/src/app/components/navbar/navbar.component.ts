import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

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
export class NavbarComponent {
  @Input() collapsed = false;
  @Output() collapsedChange = new EventEmitter<boolean>();

  readonly navItems: NavItem[] = [
    { label: 'Dashboard', route: '/dashboard', iconClass: 'bi bi-grid-1x2-fill', exact: true },
    { label: 'Voting', route: '/voting', iconClass: 'bi bi-check2-square' },
    { label: 'Issues', route: '/issues', iconClass: 'bi bi-exclamation-triangle-fill' },
    { label: 'Announcements', route: '/announcements', iconClass: 'bi bi-megaphone-fill' },
    { label: 'Bookings', route: '/bookings', iconClass: 'bi bi-calendar-week-fill' },
    { label: 'Properties', route: '/properties', iconClass: 'bi bi-house-door-fill' },
    { label: 'Documents', route: '/documents', iconClass: 'bi bi-file-earmark-text-fill' }
  ];

  toggleSidebar(): void {
    this.collapsed = !this.collapsed;
    this.collapsedChange.emit(this.collapsed);
  }
}
