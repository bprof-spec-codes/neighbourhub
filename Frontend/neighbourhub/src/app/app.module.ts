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
import { IssueEditModalComponent } from './components/issues/issue-edit-modal/issue-edit-modal.component';
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
import { ResidentsComponent } from './components/residents/residents.component';
import { RegisterComponent } from './components/register/register.component';
import { DocumentsComponent } from './components/documents/documents.component';
import { AddDocumentModalComponent } from './components/documents/add-document-modal/add-document-modal.component';
import { PendingUsersComponent } from './components/pending-users/pending-users.component';
import { MessagingComponent } from './components/messaging/messaging.component';
import { MessageNewModalComponent } from './components/messaging/message-new-modal/message-new-modal.component';
import { MessageViewModalComponent } from './components/messaging/message-view-modal/message-view-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    IssuesComponent,
    IssueCreateModalComponent,
    IssueViewModalComponent,
    IssueEditModalComponent,
    DeleteModalComponent,
    AnnouncementListComponent,
    AnnouncementAddModalComponent,
    LoginComponent,
    AuthLayoutComponent,
    MainLayoutComponent,
    VotingListComponent,
    VoteAddModalComponent,
    ResidentsComponent,
    VoteModalComponent,
    RegisterComponent,
    DocumentsComponent,
    AddDocumentModalComponent,
    PendingUsersComponent,
    MessagingComponent,
    MessageNewModalComponent,
    MessageViewModalComponent
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
