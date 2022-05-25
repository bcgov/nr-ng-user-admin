import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
//import {UserServiceService } from '../../services/user-service.service'
import {ForestClientServiceService } from '../../services/forest-client-service.service'


@Component({
  selector: 'app-forestclient',
  templateUrl: './forestclient.component.html',
  styleUrls: ['./forestclient.component.css']
})
export class ForestclientComponent implements OnInit {
  forestclient: any[] = [];
  selectedForestClient!: string;
  forestClientsObservable!: Observable<any>;

  constructor(public forestClientService: ForestClientServiceService) { }

  ngOnInit(): void {
    this.forestclient = [{name: 'client 1', id:223},
                         {name:"client2", id: 452},
                         {name:  "client 4", id:3342}];

    this.forestClientService.getForestClients().subscribe(data => {
      console.log("data: " + JSON.stringify(data));
    })

    this.forestClientsObservable = this.forestClientService.getForestClients();
  }

}
