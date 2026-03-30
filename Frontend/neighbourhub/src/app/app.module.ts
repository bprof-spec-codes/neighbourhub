import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { NavbarComponent } from './components/navbar/navbar.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AnnouncementListComponent } from './components/announcement-list/announcement-list.component';
import { DeleteModalComponent } from './components/shared/delete-modal/delete-modal.component';
import { AnnouncementAddModalComponent } from './components/announcement-list/announcement-add-modal/announcement-add-modal.component';
import { ReactiveFormsModule } from '@angular/forms';
import { VotingListComponent } from './components/voting-list/voting-list.component';
import { VoteAddModalComponent } from './components/voting-list/vote-add-modal/vote-add-modal.component';
import { VoteModalComponent } from './components/voting-list/vote-modal/vote-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    AnnouncementListComponent,
    DeleteModalComponent,
    AnnouncementAddModalComponent,
    VotingListComponent,
    VoteAddModalComponent,
    VoteModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NavbarComponent,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
