import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { catchError, EMPTY, from, map, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { CommonService } from './common.service';
import { UtilityService } from './utility.service';

@Injectable({
  providedIn: 'root',
})
export class HttpInteceptorService implements HttpInterceptor {
  constructor(
    private router: Router,
    private commonservice: CommonService,
    private utilityService: UtilityService,
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      map((result) => {
        return result;
      }),
      catchError((error: HttpErrorResponse) => {
        let errorMsg = '';
        let message = error.error.message ? error.error.message : error.message;
        if (error.error instanceof ErrorEvent) {
          errorMsg = `Error: ${message}`;
          return throwError(errorMsg);
        }
        switch (error.status) {
          case 400:
            /// Bad Request
            errorMsg = message;
            break;

          case 401:
            /// Not Authorized
            this.commonservice.showErrorToaster(`Error`, `${message}`);
            this.utilityService.clearAllLocalStorageData();
            this.router.navigate(['/login']);
            // return EMPTY; //we are handling for the login btn animation so hide this
            break;
          case 402:
            this.router.navigate(['/login']);
            break;
          case 403:
            /// Access Denied
            this.commonservice.showErrorToaster(`Error`, `${message}`);
            this.router.navigate(['/pages/dashboard']);
            return EMPTY;

          case 500:
            /// Internal server error
            errorMsg = error.message;
            break;

          case 404:
            this.commonservice.showErrorToaster(`Error`, `${message}`);
            break;
        }
        return throwError(errorMsg);
      })
    );
  }
}
