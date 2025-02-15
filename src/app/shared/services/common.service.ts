import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class CommonService {

  horizontalPosition: MatSnackBarHorizontalPosition = 'right';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  durationInSeconds = 3;

  constructor(public snackBar: MatSnackBar) {}

  /**
   * show success toaster
   * @param title -> title for toaster
   * @param message -> message for toaster
   * @param isShowCloseButton -> close button show/hide default true
   */
  showSuccessToaster(title: string, message: string, isShowCloseButton = true) {
    this.snackBar.open(message, '+', {
      duration: 3000,
      verticalPosition: 'top',
      horizontalPosition: 'right',
      panelClass: ['success-snackbar']
    });
  }

  /**
   * show error toaster
   * @param title -> title for toaster
   * @param message -> message for toaster
   * @param isShowCloseButton -> close button show/hide default true
   */
  showErrorToaster(title: string, message: string, isShowCloseButton = true) {
    this.snackBar.open(message, '+', {
      duration: 3000,
      verticalPosition: 'top',
      horizontalPosition: 'right',
      panelClass: ['error-snackbar']
    });
  }

  /**
   *
   * @param error Error Object
   */
  generateError(error: any) {
    if (error) {
      this.showErrorToaster('Error', error);
    }
  }
}
