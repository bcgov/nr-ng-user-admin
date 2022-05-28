import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {UserServiceService } from '../../services/user-service.service'

import { NgSelectModule } from '@ng-select/ng-select';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {OIDCUser} from './user.model'

// To allow any property add 'NO_ERRORS_SCHEMA' to the '@NgModule.schemas'
// of this component.
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})


export class UserComponent implements OnInit {
  users: Observable<any> | undefined;
  usersData: OIDCUser[] = []
  selectedUser: string = 'dummy';

  constructor(public userService: UserServiceService) { }

  // ngOnInit runs when the component is loaded
  ngOnInit(): void {

    // getting the users data
    // this.userService.getUsersStream().subscribe(data => {
      // TODO: need to concat the stream
     // this.usersData.push(data);
      //console.log("**************** USERS page: " + JSON.stringify(data));
    // });

    //this.users = this.userService.getUsers();
    this.users = this.userService.getUsersStream();
  }

  getUserData() {
    console.log("userdata is: " + this.usersData.length);
    console.log("example is: " + JSON.stringify(this.usersData[0]));
    return this.usersData;
  }

}
