import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SharedModule } from '../shared/shared.module';
import { AddTodoComponent } from './dashboard/add-todo/add-todo.component';
import { ConfirmationDialogComponent } from './dashboard/confirmation-dialog/confirmation-dialog.component';


@NgModule({
  declarations: [
    DashboardComponent,
    AddTodoComponent,
    ConfirmationDialogComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    PagesRoutingModule
  ]
})
export class PagesModule { }
