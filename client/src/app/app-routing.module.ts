import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AuthGuardService } from './services/auth-guard.service';
import { DASHBOARD_ROUTE, ECOCKPIT_ROUTE, LOGIN_ROUTE, REGISTER_ROUTE } from './routes';
import { ECockpitComponent } from './components/e-cockpit/e-cockpit.component';

const routes: Routes = [
  {path: LOGIN_ROUTE, component: LoginComponent},
  {path: REGISTER_ROUTE, component: RegisterComponent},
  {path: ECOCKPIT_ROUTE, component: ECockpitComponent},
  {path: "", redirectTo: LOGIN_ROUTE, pathMatch: "full"},
  {path: DASHBOARD_ROUTE, component: DashboardComponent, canActivate: [AuthGuardService]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
