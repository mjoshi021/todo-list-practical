import { AppConfig } from '../../app-config';
import { Injectable } from '@angular/core';
import { ApiInterfaceServices } from './api-interface.service';
import { UtilityService } from './utility.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user: any;

  constructor(
    private apiService: ApiInterfaceServices,
    private utility: UtilityService,
  ) {}

  /**
   * Makes a login request with the provided credentials.
   * Returns if login was successful or not.
   *
   * @param objLogin - User's email and password.
   */
  async login(objLogin: object) {
    try {
      const result = await (<any>(
        this.apiService.post(AppConfig.AUTH.LOGIN_API, objLogin).toPromise()
      ));
      if (result) {
        this.utility.setLocalStorageData(
          'auth-token',
          result['accessToken']
        );
        return result;
      }
      return false;
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
