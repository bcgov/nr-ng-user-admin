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
  @Input() userEntry: String = 'test';
  clickMessage!: String;

  myControl = new FormControl();
  options: string[] = ['One', 'Two', 'Three', 'Four'];
  filteredOptions!: Observable<string[]>;

  users: Object | undefined;

  constructor(private userService: UserServiceService) { }

  // ngOnInit runs when the component is loaded
  ngOnInit(): void {
    this.filteredOptions = this.myControl
    .valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value)),
    );

    // getting the users data
    this.userService.getUsers().subscribe(data => {
      this.users = data;
      console.log("**************** USERS page: " + JSON.stringify(this.users));
    });
  }

  private _filter(value: string): string[] {
      const filterValue = value.toLowerCase();
      return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  getUsers() {
    var userReturn: String = '';
    if (this.userEntry.length > 3) {
      userReturn = this.userEntry;
    }
    return userReturn;
  }

}
