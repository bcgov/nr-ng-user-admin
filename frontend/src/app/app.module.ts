import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

//import { RouterModule } from '@angular/router';
import { RoutingModule } from './routing/routing.module'; // CLI imports AppRoutingModuleimport { EventTypes, PublicEventsService } from 'angular-auth-oidc-client';
import { filter } from 'rxjs/operators';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSliderModule } from '@angular/material/slider';
import { MatInputModule } from '@angular/material/input';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { NgSelectModule } from '@ng-select/ng-select';


import { AppComponent } from './app.component';
import { AuthConfigModule } from './auth-config.module';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';
import { AddUserComponent } from './components/add-user/add-user.component';
import { EventTypes, PublicEventsService } from 'angular-auth-oidc-client';
import { UserComponent } from './components/user/user.component';
import { HttpClientModule } from '@angular/common/http';
import { HeaderComponent } from './components/header/header.component';
import { LoginButtonComponent } from './components/login-button/login-button.component';
import { DebugComponent } from './debug/debug.component';
import { KcSubmitComponent } from './components/kc-submit/kc-submit.component';

@NgModule({
  declarations: [
    AppComponent,
    AddUserComponent,
    UnauthorizedComponent,
    UserComponent,
    HeaderComponent,
    LoginButtonComponent,
    DebugComponent,
    KcSubmitComponent,
  ],
  imports: [
    BrowserModule,
    RoutingModule,
    AuthConfigModule,
    FormsModule, ReactiveFormsModule, NgSelectModule,
    BrowserAnimationsModule,
    MatSliderModule, MatInputModule, MatAutocompleteModule,
    HttpClientModule
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
