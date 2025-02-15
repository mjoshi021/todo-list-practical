import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { UtilityService } from './utility.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService implements CanActivate {
  constructor(private utilityService: UtilityService, private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    /**
     * get token form local storage
     */
    let token = this.utilityService.getLocalStorageData('auth-token');
    let user = this.utilityService.getLocalStorageData('user-data')
    if(user && !user?.is_email_verified){
      if((!state.url.includes('dashboard')) && (!state.url.includes('verify-email'))){
        this.router.navigate(['dashboard'])
        return false;
      }
    }
    /**
     * if token then redirect to new routes
     */
    if (token) {
      return true;
    }

    /**
     * if token not found then redirect to login page
     */
    this.router.navigate(['login']);
    return false;
  }
}
