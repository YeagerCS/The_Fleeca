import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { DASHBOARD_ROUTE, ECOCKPIT_ROUTE, LOGIN_ROUTE, REGISTER_ROUTE } from '../routes';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {  
  constructor(private router: Router) { }
  getLogin(){
    this.router.navigate([LOGIN_ROUTE])
  }

  getRegister() {
    this.router.navigate([REGISTER_ROUTE])
  }

  getDashboard() {
    this.router.navigate([DASHBOARD_ROUTE])
  }

  getEcockpit(){
    this.router.navigate([ECOCKPIT_ROUTE])
  }

}
