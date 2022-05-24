import { Component, OnInit } from '@angular/core';
import {UserServiceService } from '../../services/user-service.service'


@Component({
  selector: 'app-forestclient',
  templateUrl: './forestclient.component.html',
  styleUrls: ['./forestclient.component.css']
})
export class ForestclientComponent implements OnInit {
  forestclient: any[] = [];
  selectedForestClient!: number;

  constructor(public userService: UserServiceService) { }

  ngOnInit(): void {
    this.forestclient = [{name: 'client 1', id:223},
                         {name:"client2", id: 452},
                         {name:  "client 4", id:3342}];
  }

}
