import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AnnouncementListComponent } from './components/announcement-list/announcement-list.component';
import { VotingListComponent } from './components/voting-list/voting-list.component';
import { LoginComponent } from './components/login/login.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { authGuard } from './services/guards/auth.guard';
import { ResidentsComponent } from './components/residents/residents.component';
import { IssuesComponent } from './components/issues/issues.component';
import { RegisterComponent } from './components/register/register.component';
import { DocumentsComponent } from './components/documents/documents.component';
import { PendingUsersComponent } from './components/pending-users/pending-users.component';
import { adminGuard } from './services/guards/admin.guard';
import { MessagingComponent } from './components/messaging/messaging.component';
import { BookingsComponent } from './components/bookings/bookings.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

const routes: Routes = [
  {
    path: 'auth',
    component: AuthLayoutComponent,
    children: [
      {path: 'register', component: RegisterComponent },
      {path: 'login', component: LoginComponent }
    ]
  },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
      { path: 'announcements', component: AnnouncementListComponent, canActivate: [authGuard] },
      { path: 'voting', component: VotingListComponent, canActivate: [authGuard] },
      { path: 'residents', component: ResidentsComponent, canActivate: [authGuard] },
      { path: 'issues', component: IssuesComponent, canActivate: [authGuard] },
      { path: 'documents', component: DocumentsComponent, canActivate: [authGuard] },
      { path: 'pendingUsers', component: PendingUsersComponent, canActivate: [authGuard, adminGuard] },
      { path: 'messaging', component: MessagingComponent, canActivate: [authGuard] },
      { path: 'bookings', component: BookingsComponent, canActivate: [authGuard] },
    ]
  },
  { path: '**', redirectTo: '/dashboard' },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
