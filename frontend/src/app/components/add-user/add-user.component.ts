import { ConditionalExpr } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { OidcClientNotification, OidcSecurityService, OpenIdConfiguration, UserDataResult } from 'angular-auth-oidc-client';
import { Observable } from 'rxjs';
import { UserComponent } from '../user/user.component'

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {

  // constructor() {}
  // ngOnInit(): void {
  // }


  configuration!: Observable<OpenIdConfiguration>;
  userDataChanged!: Observable<OidcClientNotification<any>>;
  userData!: Observable<UserDataResult>;


  isAuthenticated: boolean = false;

  constructor(public oidcSecurityService: OidcSecurityService) {}

  ngOnInit(): void {
    this.configuration = this.oidcSecurityService.getConfiguration();

    this.userData = this.oidcSecurityService.userData$;


    this.oidcSecurityService.isAuthenticated$.subscribe(({ isAuthenticated }) => {
      this.isAuthenticated = isAuthenticated;

      console.warn('authenticated: ', this.isAuthenticated);
    });
  }

  login() {
    this.oidcSecurityService.authorize();
  }

  logout() {
    this.oidcSecurityService.logoff();
  }
}
