import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthModule } from './auth/auth.module';
import { AnonymousGuardService } from './shared/services/anonymous-guard.service';
import { AuthGuardService } from './shared/services/auth-guard.service';

const routes: Routes = [
  { path: "", redirectTo: "/login", pathMatch: "full" },
  {
    path: "", loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
    canActivate: [AnonymousGuardService],
  },
  {
    path: "pages", loadChildren: () =>
      import('./pages/pages.module').then((m) => m.PagesModule),
    canActivate: [AuthGuardService],
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
