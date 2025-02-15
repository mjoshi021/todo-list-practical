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
export class AnonymousGuardService implements CanActivate {
  constructor(private utilityService: UtilityService, private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    /**
     * get token form local storage
     */
    let token = this.utilityService.getLocalStorageData('auth-token');

    /**
     * if token then dont redirect to login
     */
    if (token) {
      this.router.navigate(['/pages/dashboard']);
      return false;
    }

    /**
     * if token not found then redirect
     */
    return true;
  }
}
