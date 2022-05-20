import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {UserServiceService } from '../../services/user-service.service'


import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})

export class UserComponent implements OnInit {
  users: Observable<Object> | undefined;
  usersData: Object[] = []
  selectedUser: string = 'dummy';

  constructor(private userService: UserServiceService) { }

  // ngOnInit runs when the component is loaded
  ngOnInit(): void {

    // getting the users data
    this.userService.getUsers().subscribe(data => {
      // TODO: need to concat the stream
      this.usersData.concat(data);
      console.log("**************** USERS page: " + JSON.stringify(data));
    });

    this.users = this.userService.getUsers()
  }

}
