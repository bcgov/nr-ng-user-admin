import { Component, OnInit } from '@angular/core';
import { OidcClientNotification, OidcSecurityService, OpenIdConfiguration, UserDataResult } from 'angular-auth-oidc-client';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-debug',
  templateUrl: './debug.component.html',
  styleUrls: ['./debug.component.css']
})
export class DebugComponent implements OnInit {
  userData!: Observable<UserDataResult>;

  constructor(public oidcSecurityService: OidcSecurityService) { }

  ngOnInit(): void {
    this.userData = this.oidcSecurityService.userData$;

  }

}
