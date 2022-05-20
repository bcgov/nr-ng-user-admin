import { NgModule } from '@angular/core';
import { AuthModule, LogLevel } from 'angular-auth-oidc-client';

@NgModule(
  {
  imports: [
    AuthModule.forRoot({
      config: {
        authority: 'https://dev.oidc.gov.bc.ca/auth/realms/ichqx89w/.well-known/openid-configuration',
        redirectUrl: window.location.origin,
        postLogoutRedirectUri: window.location.origin,
        clientId: 'fom-user-manager',
        scope: 'openid', //profile email taler_api offline_access
        responseType: 'code',
        // autoUserInfo: true,
        silentRenew: true,
        useRefreshToken: true,
        logLevel: LogLevel.Debug,
        renewTimeBeforeTokenExpiresInSeconds: 10,
        silentRenewTimeoutInSeconds: 15,
        maxIdTokenIatOffsetAllowedInSeconds: 10,
      },
    }),
  ],
  exports: [AuthModule],
})
export class AuthConfigModule {}
