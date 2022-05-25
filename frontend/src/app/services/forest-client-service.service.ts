import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
// oidc will be used later on once backend is set up to guard the end points.
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { environment } from '../../environments/environment';
import {Observable, switchMap, toArray }  from 'rxjs';
import {ForestClientElement, ForestClientResponse} from '../components/forestclient/forestclient.model'

@Injectable({
  providedIn: 'root'
})

export class ForestClientServiceService {
  forestClientEndPoint!: string;

  constructor(private http: HttpClient) {
    //http://127.0.0.1:5000/forest_client
    this.forestClientEndPoint = `${environment.forestClientAPI}/forest_client`
  }

  getHeader() {
    /**
     * creates a header and attached the bearer token to allow for communication
     * with auth provider (keycloak)
     */
    const headerDict = {
      'Accept': 'application/json'
    };
    //'Authorization': 'Bearer ' + this.oidcAccessToken
    const httpHeads = new HttpHeaders(headerDict);
    return httpHeads;
  };

  getForestClients() {
    let httpHeads = this.getHeader();
    let ForestClientRequest = this.http.get<ForestClientResponse>(this.forestClientEndPoint, {
      "headers": httpHeads
    }).pipe(
      switchMap((response): any => {
        console.log("input items: " + response);
        const newLocal = 'items';
        return response.items;
      }),
      toArray()
    );
    //"params": params
    return ForestClientRequest;
  }

}
