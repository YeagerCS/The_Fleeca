import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from './auth.service';
import { AccountService } from './account.service';
import { LocalstorageService } from './localstorage.service';
import { Observable, map, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate{
  constructor(private router: Router, private lsService: LocalstorageService, private authService: AuthService){}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    const jwt = this.lsService.load();
    if(!jwt){
      return this.router.navigate(["/login"])
    }

    return this.authService.validateJwt(jwt).pipe(
      map(isValid => {
        if(!isValid){
          this.router.createUrlTree(['/login'])
          return false;
        }
        return true;
      })
    )
  }

  
}
