import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AuthGuardService } from './services/auth-guard.service';
import { NavigationService } from './services/navigation.service';

const routes: Routes = [
  {path: "login", component: LoginComponent},
  {path: "register", component: RegisterComponent},
  {path: "", redirectTo: "/login", pathMatch: "full"},
  {path: "dashboard", component: DashboardComponent, canActivate: [AuthGuardService]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
