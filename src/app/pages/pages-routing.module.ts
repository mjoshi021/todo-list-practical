import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AddTodoComponent } from './dashboard/add-todo/add-todo.component';

const routes: Routes = [
  {path:'', redirectTo:'dashboard', pathMatch:"full"},
  {path:'dashboard', component:DashboardComponent},
  {path:'dashboard/create-todo', component:AddTodoComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
