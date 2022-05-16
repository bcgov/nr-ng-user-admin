import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
//import { RouterModule } from '@angular/router';
import { RoutingModule } from './routing/routing.module'; // CLI imports AppRoutingModuleimport { EventTypes, PublicEventsService } from 'angular-auth-oidc-client';
import { filter } from 'rxjs/operators';

import { AppComponent } from './app.component';
import { AuthConfigModule } from './auth-config.module';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';
import { AddUserComponent } from './components/add-user/add-user.component';
import { EventTypes, PublicEventsService } from 'angular-auth-oidc-client';

@NgModule({
  declarations: [
    AppComponent,
    UnauthorizedComponent,
    AddUserComponent
  ],
  imports: [
    BrowserModule,
    RoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private readonly eventService: PublicEventsService) {
    this.eventService
      .registerForEvents()
      .pipe(filter((notification) => notification.type === EventTypes.ConfigLoaded))
      .subscribe((config) => {
        console.log('ConfigLoaded', config);
      });
  }
}
