import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  constructor(private router: Router) { }
  public loginRoute = 'login'
  public registerRoute = 'register'
  public dashboardRoute = 'dashboard'
  // TODO: Isn't used.
  getLogin(){
    this.router.navigate([this.loginRoute])
  }

  getRegister() {
    this.router.navigate([this.registerRoute])
  }

  getDashboard() {
    this.router.navigate([this.dashboardRoute])
  }

}
