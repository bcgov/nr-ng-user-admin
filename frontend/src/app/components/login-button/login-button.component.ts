import { Component, OnInit } from '@angular/core';
import { OidcClientNotification, OidcSecurityService, OpenIdConfiguration, UserDataResult } from 'angular-auth-oidc-client';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-login-button',
  templateUrl: './login-button.component.html',
  styleUrls: ['./login-button.component.css']
})

export class LoginButtonComponent implements OnInit {

  configuration!: Observable<OpenIdConfiguration>;
  userDataChanged!: Observable<OidcClientNotification<any>>;
  buttonText: String = "Login"

  isAuthenticated: boolean = false;


  constructor(public oidcSecurityService: OidcSecurityService) {}

  ngOnInit(): void {
    this.configuration = this.oidcSecurityService.getConfiguration();

    this.oidcSecurityService.isAuthenticated$.subscribe(({ isAuthenticated }) => {
      this.isAuthenticated = isAuthenticated;

      console.warn('authenticated: ', this.isAuthenticated);
      if (this.isAuthenticated) {
        this.buttonText = 'Logout'
      }
    });
  }

  loginLogout() {
    if (this.isAuthenticated) {
      this.logout();
    } else {
      this.login();
    }
  }

  login() {
    this.oidcSecurityService.authorize();
    this.isAuthenticated = true;
    this.buttonText = 'Logout'
  }

  logout() {
    this.oidcSecurityService.logoff();
    this.isAuthenticated = false;
    this.buttonText = 'Login'
  }

  refreshSession() {
    this.oidcSecurityService.forceRefreshSession().subscribe((result) => console.log("REFRESH" + result));
  }

  logoffAndRevokeTokens() {
    this.oidcSecurityService.logoffAndRevokeTokens().subscribe((result) => console.log(result));
  }

  revokeRefreshToken() {
    this.oidcSecurityService.revokeRefreshToken().subscribe((result) => console.log(result));
  }

  revokeAccessToken() {
    this.oidcSecurityService.revokeAccessToken().subscribe((result) => console.log(result));
  }

}
