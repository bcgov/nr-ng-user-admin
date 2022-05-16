import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthConfigModule } from '../auth-config.module';

import { UnauthorizedComponent } from '../components/unauthorized/unauthorized.component';
import { AddUserComponent } from '../components/add-user/add-user.component';


@NgModule({
  imports: [
    BrowserModule,
    RouterModule.forRoot([
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: AddUserComponent },
      { path: 'forbidden', component: UnauthorizedComponent },
      { path: 'unauthorized', component: UnauthorizedComponent },
    ]),
    AuthConfigModule,
  ],
  exports: [RouterModule],
})
export class RoutingModule { }
