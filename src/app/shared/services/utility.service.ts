import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  constructor() { }

   // Set localstorage data
   setLocalStorageData(key:any, value:any) {
    const encode = JSON.stringify(value);
    localStorage.setItem(key, window.btoa(encode));
  }

  // Get localstorage data
  getLocalStorageData(key:any) {
  if (localStorage.getItem(key)) {
    const decode = window.atob(localStorage.getItem(key)!);
    return JSON.parse(decode);
    } else {
    return null;
    }
  }

  /**
   * remove key data from local storage.
   */
  removeLocalStorageData(key: string): void {
    localStorage.removeItem(key);
  }

  /**
   * clear all local storage data.
   */
  clearAllLocalStorageData(): void {
    localStorage.clear();
  }
}
