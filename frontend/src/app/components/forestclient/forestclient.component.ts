import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
//import {UserServiceService } from '../../services/user-service.service'
import { ForestClientServiceService } from '../../services/forest-client-service.service'
import { ForestClientElement, ForestClientResponse } from './forestclient.model'


@Component({
  selector: 'app-forestclient',
  templateUrl: './forestclient.component.html',
  styleUrls: ['./forestclient.component.css']
})

export class ForestclientComponent implements OnInit {
  forestclient: any[] = [];
  selectedForestClient!: string;
  forestClientsObservable!: Observable<any>;
  bufferSize: number = 100;
  forestclientBuffer: any[] = [];
  loading = false;

  constructor(public forestClientService: ForestClientServiceService) { }

  ngOnInit(): void {
    // this.forestclient = [{ name: 'client 1', id: 223 },
    // { name: "client2", id: 452 },
    // { name: "client 4", id: 3342 }];
    this.forestclientBuffer = [];
    console.log("forest client data: "+ this.forestclient)
    if (!this.forestclient.length) {
      this.loading = true;
      this.forestClientsObservable = this.forestClientService.getAllForestClients();

      this.forestClientsObservable.subscribe(data => {
        //console.log("forest client data: " + JSON.stringify(data));
        console.log("loading in data in observable: " + this.loading);
        this.forestclient = data;
        this.forestclientBuffer = [];
        this.loading = false
        console.log("finished loading: " + this.loading);

      })
    }
  }

  onSearch($event: Event) {
    console.log("input event: " + JSON.stringify($event));
    // let ItemsToAdd: Array<any> = [];
    let ItemsToAdd: ForestClientElement[] = [];
    let searchString = $event.term;
    self.console.log()
    console.log("loading..."  + this.loading);
    if (searchString.length >= 3 && !this.loading) {
      this.loading = true;
      // setTimeout(() => {
        for (let x = 0; x < this.forestclient.length; x++) {
          if (this.forestclient[x]['forest_client_name'].toLowerCase().includes(searchString.toLowerCase())) {
            //this.forestclientBuffer.push(this.forestclient[x]);
            if (!this.forestclientBuffer.includes(this.forestclient[x])) {
              ItemsToAdd.push(this.forestclient[x]);
              console.log("adding element: " + this.forestclient[x]['forest_client_name'])
            }
          }
          ItemsToAdd.sort((a, b) => (a.forest_client_name > b.forest_client_name) ? 1 : -1)
          this.loading = false;
        }
      // }, 20);
      this.forestclientBuffer = this.forestclientBuffer.concat(ItemsToAdd);
      return;
    } else {
      this.forestclientBuffer = [];
    }
    //this.forestclientBuffer = this.forestclientBuffer.concat(ItemsToAdd);
  }
}


interface Event {
  term: string;
  items: Array<any>;
}


// This example does what we want:
// https://github.com/ng-select/ng-select/blob/master/src/demo/app/examples/virtual-scroll-example/virtual-scroll-example.component.html
//https://ng-select.github.io/ng-select#/events