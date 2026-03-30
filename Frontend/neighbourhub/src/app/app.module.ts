import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, provideHttpClient, withInterceptors } from '@angular/common/http';
import { NavbarComponent } from './components/navbar/navbar.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { IssuesComponent } from './components/issues/issues.component';
import { IssueCreateModalComponent } from './components/issues/issue-create-modal/issue-create-modal.component';
import { IssueViewModalComponent } from './components/issues/issue-view-modal/issue-view-modal.component';
import { DeleteModalComponent } from './components/shared/delete-modal/delete-modal.component';
import { AnnouncementListComponent } from './components/announcement-list/announcement-list.component';
import { AnnouncementAddModalComponent } from './components/announcement-list/announcement-add-modal/announcement-add-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './components/login/login.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { authInterceptor } from './interceptors/auth.interceptor';
import { VotingListComponent } from './components/voting-list/voting-list.component';
import { VoteAddModalComponent } from './components/voting-list/vote-add-modal/vote-add-modal.component';
import { VoteModalComponent } from './components/voting-list/vote-modal/vote-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    IssuesComponent,
    IssueCreateModalComponent,
    IssueViewModalComponent,
    DeleteModalComponent,
    AnnouncementListComponent,
    AnnouncementAddModalComponent,
    LoginComponent,
    AuthLayoutComponent,
    MainLayoutComponent,
    VotingListComponent,
    VoteAddModalComponent,
    VoteModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NavbarComponent,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    provideHttpClient(withInterceptors([authInterceptor]))
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
