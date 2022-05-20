import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthConfigModule } from '../auth-config.module';

import { UnauthorizedComponent } from '../components/unauthorized/unauthorized.component';
import { AddUserComponent } from '../components/add-user/add-user.component';
import { DebugComponent } from '../debug/debug.component';


@NgModule({
  imports: [
    BrowserModule,
    RouterModule.forRoot([
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: AddUserComponent },
      { path: 'debug', component: DebugComponent },
    ]),
    AuthConfigModule,
  ],
  exports: [RouterModule],
})
export class RoutingModule { }
