import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { finalize, tap } from 'rxjs/operators';
import { UtilityService } from './utility.service';
import { environment } from 'src/envireonments/envirenment';

@Injectable({ providedIn: 'root' })
export class ApiInterfaceServices {
  previousPostRequestData: any; // This is used to cache the request data going out in post API calls

  previousPostRequestResult: any; // stores the result of the cached request

  constructor(private http: HttpClient,
    private utilityService:UtilityService) {}

  /**
   * Sends a HTTP POST to the API at the given end point path.
   *
   * @param path - The end point path to send the request to.
   * @param body - The body of the post request.
   * @param [requireAuth=false] - If the call should have the auth headers attached.
   * @param [params] - Optional query params for the request.
   * @param [responseType=false] -Set response type flag for file type.
   * @param fullResponse - To get response object and not the body content.
   */
  post(
    path: string,
    body: any,
    requireAuth = false,
    params?: any,
    responseType = false,
    fullResponse = false
  ) {
    // check if responseType = false then set response type arraybuffer
    const options: {
      headers?: HttpHeaders;
      observe?: any;
      params?: HttpParams;
      reportProgress?: boolean;
      responseType: any;
      withCredentials?: boolean;
    } = {
      params,
      headers: this.generateHeaders(requireAuth) as HttpHeaders,
      responseType: responseType ? ('arraybuffer' as const) : 'json',
      observe: fullResponse ? ('response' as const) : 'body',
    };

    // The previous and current data is different so lets proceed with the request and take the data in global variable
    // this.previousPostRequestData = currentPostRequestData;

    return this.http.post(environment.baseUrl + path, body, options).pipe(
      tap(
        (res) => {
          // Tap into the response, so we can set the previousRequestPostResult to give to any subsequent duplicate API calls
          this.previousPostRequestResult = res;
        },
        (err) => {
          // if the result is an error, then we don't want to adhere to the 10 second rule, let them retry again if they choose to
          this.previousPostRequestData = null;
          this.previousPostRequestResult = null;
        }
      ),
      finalize(() => {
        // finalize is called whenever the observable is closed
        setTimeout(() => {
          // To substantially block duplicate requests, we need timeout
          this.previousPostRequestData = null;
          this.previousPostRequestResult = null;
        }, 10000); // This means two post requests with same data wont be entertained within 10 seconds.
      })
    );
  }

  /**
   * Sends a HTTP PUT to the API at the given end point path.
   *
   * @param path - The end point path to send the request to.
   * @param body - The body of the put request.
   * @param [requireAuth=false] - If the call should have the auth headers attached.
   * @param [params] - Optional query params for the request.
   * @param [responseType=false] -Set response type flag for file type.
   *
   */
  put(
    path: string,
    body: any,
    requireAuth = false,
    params?: any,
    responseType = false
  ) {
    // check if responseType = false then set response type arraybuffer
    if (responseType) {
      return this.http.put(environment.baseUrl + path, body, {
        params,
        headers: this.generateHeaders(requireAuth),
        responseType: 'arraybuffer',
      });
    }
    return this.http.put(environment.baseUrl + path, body, {
      params,
      headers: this.generateHeaders(requireAuth),
    });
  }

  /**
   * Sends a HTTP PATCH to the API at the given end point path.
   *
   * @param path - The end point path to send the request to.
   * @param body - The body of the patch request.
   * @param [requireAuth=false] - If the call should have the auth headers attached.
   * @param [params] - Optional query params for the request.
   *
   */
  patch(path: string, body: any, requireAuth = false, params?: any) {
    return this.http.patch(environment.baseUrl + path, body, {
      params,
      headers: this.generateHeaders(requireAuth),
    });
  }

  /**
   * Sends a HTTP GET to the API at the given end point path.
   *
   * @param path - The end point path to send the request to.
   * @param [requireAuth=false] - If the call should have the auth headers attached.
   * @param [params] - Optional query params for the request.
   * @param withCredentials - Optional if the request should attach http cookie for auth.
   * @param [responseType=false] -Set response type flag for file type.
   *
   */
  get(
    path: string,
    requireAuth = false,
    params?: any,
    withCredentials?: boolean,
    responseType = false
  ) {
    // check if responseType = true then set response type arraybuffer
    const options: {
      headers?: HttpHeaders;
      params?: HttpParams;
      responseType: any;
      withCredentials?: boolean;
    } = {
      params,
      headers: this.generateHeaders(requireAuth,path) as HttpHeaders,
      responseType: responseType ? ('arraybuffer' as const) : 'json',
      withCredentials,
    };

    return this.http.get(environment.baseUrl + path, options);

  }

  /**
   * Sends a HTTP DELETE to the API at the given end point path.
   *
   * @param path - The end point path to send the request to.
   * @param {boolean=false} requireAuth - If the call should have the auth headers attached.
   * @param params - Optional query params for the request.
   * @param withCredentials - Optional if the request should attach http cookie for auth.
   */
  delete(
    path: string,
    requireAuth = false,
    params?: any,
    withCredentials?: boolean
  ) {
    return this.http.delete(environment.baseUrl + path, {
      params,
      headers: this.generateHeaders(requireAuth),
      withCredentials,
    });
  }
  // getRefreshTokenEndpoint(): Observable<string> {
  //   return this.http.get(environment.baseUrl + AppConfig.AUTH.GET_TOKEN, { observe: 'response' }).pipe(
  //     map((response:any) => response.headers.get(AppConfig.AUTH.GET_TOKEN))
  //   );
  // }

  /**
   * Add Authorization Token and API key to the request.
   *
   * @param authHeaderRequired - If the call should have the auth
   * headers attached.
   */
  generateHeaders(authHeaderRequired: boolean,apiEndpoint?:string): HttpHeaders {
    // append our api key
    let header = new HttpHeaders();

    // add our auth header if required
    if (authHeaderRequired) {
      // const unparsedToken = window.localStorage.getItem('auth-token');
      let unparsedToken: any;

      //change to api end pointwise set refresh-token

      unparsedToken = this.utilityService.getLocalStorageData('auth-token');

      if (unparsedToken) {
        header = header.set('Authorization', `Bearer ${unparsedToken}`);
      }
    }

    // add the isWeb header (used for analytics)
    // header = header.set('isWeb', 'true');

    return header;
  }
}
