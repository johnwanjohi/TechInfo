import { Component, ViewChild } from '@angular/core';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthService } from 'app/shared/auth/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { takeUntil } from 'rxjs/operators';
import { AccountsService } from '../../../shared/services/accounts.service';


import * as userActions from '../../../shared/app-state/actions';
import * as fromRoot from '../../../shared/app-state';
import { Subject } from 'rxjs';
import { EncryptionService } from '../../../shared/services/encryption.service';
import { environment } from 'environments/environment.prod';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})

export class LoginPageComponent {

  loginFormSubmitted = false;
  isLoginFailed = false;
  isLoggedIn = false;

  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    rememberMe: new FormControl(true)
  });
  model: User = new User();
  destroy$: Subject<boolean> = new Subject<boolean>();
  constructor(private router: Router, private authService: AuthService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute, private readonly store: Store, private AC: AccountsService,
    private encyption :EncryptionService
    ) {
    this.store.select(fromRoot.userLogin).pipe(
      takeUntil(this.destroy$)
    ).subscribe(data => {
      // alert(JSON.stringify((data)));
      console.dir(data);
      if( data?.result !== undefined){
        if(data.isLoadingSuccess){
          window.localStorage.setItem('token', data.result?.token);
          this.AC.userDetails.next(data.user);
          this.AC.loggedInUserRole = data.result?.roles?.name;
          this.AC.isLoggedIn = true;
          this.isLoggedIn = this.AC.isLoggedIn;
          this.router.navigate(['/page/dashboard']);
        } else {
          if (this.loginFormSubmitted === true) {
            setTimeout(() => {
              this.isLoginFailed = true;
              this.spinner.hide();
            }, 100);
          }
        }
      }
      // if (data.isLoadingSuccess && data.result?.users?.length !== 0) {
    });
  }

  get lf() {
    return this.loginForm.controls;
  }

  // On submit button click
  onSubmit() {
    this.loginFormSubmitted = true;
    this.isLoginFailed = false;
    if (this.loginForm.invalid) {
      return;
    }

    this.spinner.show(undefined,
      {
        type: 'ball-triangle-path',
        size: 'medium',
        bdColor: 'rgba(0, 0, 0, 0.8)',
        color: '#fff',
        fullScreen: true
      });

    if (this.loginForm.invalid) {
      alert('Login details required');
      return;
    }
    //tslint:disable-next-line:prefer-const
    const userName= this.encyption.set(this.loginForm.controls.username.value);
    const passwordData= this.encyption.set(this.loginForm.controls.password.value);
    let params = {
      action: 'login',
      module: 'users',
      username: userName,
      password: passwordData,
    };
    this.store.dispatch(userActions.login({ user: params }));

  }

}

export class User {
  public username: string;
  public password: string;

  constructor(

  ) { }



}
