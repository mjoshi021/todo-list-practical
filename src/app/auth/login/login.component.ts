import { UtilityService } from './../../shared/services/utility.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth-service';
import { CommonService } from 'src/app/shared/services/common.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  reactiveForm: UntypedFormGroup;
  hide = true;

  @ViewChild('password') passwordElement !: ElementRef;
  @ViewChild('sendBtn') sendBtn : any;

  constructor(
    private fb: UntypedFormBuilder,
    private authService: AuthService,
    private commonService: CommonService,
    private router: Router,
    private utility: UtilityService,
  ) {
    this.reactiveForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {}

  onEnterPassword(){
    this.sendBtn.matButton.nativeElement.click();
  }

  onLoginClick(): void {
    if (this.reactiveForm.valid) {
      this.login();
    } 
    else {
      this.reactiveForm.markAllAsTouched();
    }
  }

  focusPassword(){
    this.passwordElement?.nativeElement.focus()
  }

  /**
   * Attempts login via the auth service with the loginForm credentials
   * and redirects user if successful.
   */
  async login(): Promise<void>{
    try {
      const result = await this.authService.login(this.reactiveForm.value);
      if (result) {
        // this.commonService.showSuccessToaster('Login', result?.status);
        this.router.navigate(['pages/dashboard']);
      }
    } catch (error: any) {
      this.commonService.generateError(error);
      // show error dailog
    } finally {
      // this.isShowButtonLoader = false;
    }
  }

  /**
   *
   * @param control -> form filed
   * @param error -> error according to control
   * @returns -> true/false according to error
   */
  public errorHandling = (control: string, error: string) => {
    return this.reactiveForm.controls[control].hasError(error);
  };
}

