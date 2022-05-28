import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
// oidc will be used later on once backend is set up to guard the end points.
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { environment } from '../../environments/environment';
import { Observable, switchMap, toArray, map, mergeMap, expand, reduce, EMPTY, tap, catchError, of } from 'rxjs';
import { ForestClientElement, ForestClientResponse } from '../components/forestclient/forestclient.model'

@Injectable({
  providedIn: 'root'
})

export class ForestClientServiceService {
  forestClientEndPoint!: string;
  pagesize: number = 1000;
  currentPageStart: number = 0;
  //accumulatorSeed!: Array<ForestClientElement> = [];

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
    let params = this.getParams(220)[0];
    let ForestClientRequest = this.http.get<ForestClientResponse>(this.forestClientEndPoint, {
      "headers": httpHeads,
      "params": params
    }).pipe(
      switchMap((response): any => {
        //console.log("input items: " + response['items'].length);
        const newLocal = 'items';
        return response.items;
      }),
      toArray()
    );
    //"params": params
    return ForestClientRequest;
  }

  getAllForestClients(): Observable<ForestClientElement[]> {
    return new Observable(observer => {
      this.getPage(this.forestClientEndPoint, this.currentPageStart).pipe(
        expand((data, i) => {
          let itemsFetched = i * this.pagesize;

         // console.log("forestclient data: " + data.result.total + ' ' + i)
          //console.log("records returned: " + data.result)
          return itemsFetched < data.result.total ? this.getPage(this.forestClientEndPoint, data.next) : EMPTY;

        }),
        reduce((acc, data) => acc.concat(data.result.items), [] as Array<ForestClientElement>
          // return acc;
        )
        // catchError(error => of(`Bad Promise: ${error}`)),

        // subscribe((people) => {
        //           observer.next(people);
        //           observer.complete();
        //     });https://ng-select.github.io/ng-select#/events
      ).subscribe(data => {
        observer.next(data);
        observer.complete();
      })
    });
  }

  getParams(first: number): [HttpParams, number] {
    let params = new HttpParams()
      .set("offset", String(first * this.pagesize))
      .set("limit", String(this.pagesize));
    first = first + 1;
    //console.log('forest client page params: ' + first + ' ' + params);
    return [params, first];
  }

  getPage(url: string, first: number): Observable<ForestClientPage> {
    let pageParams = this.getParams(first);
    let nextPage = pageParams[1];
    let params = pageParams[0];
    let header = this.getHeader();
    //console.log("request for forestclientdata: " + url + ' ' + first + ' ' + params)

    return this.http.get<ForestClientResponse>(url, { "headers": header, "params": params }).pipe(
      tap(response => {
        //console.log("tap forest client response: " + response);
      }),
      map(response => {
        //console.log("forestclient response: " + response);
        return {
          next: nextPage,
          //result: response['items'] as ForestClientElement[]
          result: response
        };
      }
      )
    )
  }
}

export interface ForestClientPage {
  //result: Array<ForestClientElement>;
  result: ForestClientResponse;
  next: number;
}
