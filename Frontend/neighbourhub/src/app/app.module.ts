import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TestComponent } from './components/test/test.component';
import { HttpClientModule } from '@angular/common/http';
import { NavbarComponent } from './components/navbar/navbar.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { IssuesComponent } from './components/issues/issues.component';
import { IssueCreateModalComponent } from './components/issues/issue-create-modal/issue-create-modal.component';
import { IssueViewModalComponent } from './components/issues/issue-view-modal/issue-view-modal.component';
import { DeleteModalComponent } from './components/shared/delete-modal/delete-modal.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    TestComponent,
    DashboardComponent,
    IssuesComponent,
    IssueCreateModalComponent,
    IssueViewModalComponent,
    DeleteModalComponent
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
