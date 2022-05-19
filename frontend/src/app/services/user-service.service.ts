import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, JsonpClientBackend  } from '@angular/common/http';
import { OidcClientNotification, OidcSecurityService, OpenIdConfiguration, UserDataResult } from 'angular-auth-oidc-client';
import { Observable, of, mergeMap, switchMap, firstValueFrom, from, tap, Subscriber, take, publish  } from 'rxjs';
import { AuthModule, LogLevel } from 'angular-auth-oidc-client';
import jwtDecode, { JwtPayload } from "jwt-decode";
import { UrlSerializer,  } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {
  oidcAccessToken!: string;
  httpHeader: HttpHeaders = new HttpHeaders();
  oidcURI: string = '';
  oidcAuthURI: string = '';
  first :number = 0;
  max : number= 100;


  constructor(
    private http: HttpClient,
    public oidcSecurityService: OidcSecurityService) {
          this.oidcSecurityService.getAccessToken().subscribe((token) => {
              this.oidcAccessToken = token;
              var decodedToken = jwtDecode<JwtPayload>(this.oidcAccessToken);
              console.log("decodedToken " + this.oidcURI );

              // need to tweak the url by from
              // <KC_HOST>/auth/realms/<KC_REALM>"
              // to
              //<KC_HOST>/auth/admin/realms/<KC_REALM>"
              // || in case property is not populated
              this.oidcURI = decodedToken.iss || '';
              this.oidcAuthURI = this.oidcURI.replace('/auth/', '/auth/admin/');
            }
          );
  }

  // create an observable that sends 'first' and 'max' parameters for an api call, keep on iterating
  // when api call returns 0 records should trigger observable complete.



  getHeader() {
    const headerDict = {
      'Content-type': 'application/json',
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + this.oidcAccessToken
    };
    const httpHeads = new HttpHeaders(headerDict);
    return httpHeads;
  };

  getUserPageParams(numUsers: string) {
    let userPageParams = [];
    let dataNumber: number = parseInt(numUsers);
    for (let x = 0; x < dataNumber; x+=50){
      userPageParams.push({"first": x.toString(), "max": "100"});
      console.log("page params: " + x)
    }
    //return userPageParams;
    console.log("userPageParams : " + JSON.stringify(userPageParams));
    return userPageParams;
  }

  getTotalUsers() {
    const httpHeads: HttpHeaders = this.getHeader();
    return this.http.get(this.oidcAuthURI + '/users/count',
        { "headers": httpHeads });
  }

  getPageParams() {
  //async getPageParams() {
    // let myvar = await firstValueFrom(this.getTotalUsers());
    let totalUsers: any;
    //let myvar = firstValueFrom(this.getTotalUsers());
    let myvar = this.getTotalUsers().pipe(take(1)).subscribe( param => {
      totalUsers = param;
    });
    console.log("page totalUsers: " + totalUsers);

    console.log("page total users: " + JSON.stringify(totalUsers));
    let pageParms: pageParamModel[] = this.getUserPageParams(totalUsers.toString());
    //return Observable.fromPromise(pageParms);
    console.log("getPageParams: " + JSON.stringify(pageParms));
    return pageParms;
  }

  getUsersPage(first: string, max: string) {
    const httpHeads: HttpHeaders = this.getHeader();
    const params = new HttpParams()
    .set("first", first )
    .set("max", max );
    console.log('get user page params: ' + JSON.stringify(params) + ' ' + first)
    return this.http.get(this.oidcAuthURI + '/users', { "headers": httpHeads,
        "params": params });
  }

// Type 'Promise<[]>' must have a '[Symbol.iterator]()' method that returns an iterator.
// Type 'Promise<[]>' is missing the following properties from type '[]': length, pop, push, concat, and 28 more.
 getUsers() {
    let inputParams = this.getPageParams();

  //   let pageParms = new Observable<pageParamModel[]>( subscriber => {
  //     //for (let x=0; x<inputParmas.length; x++) {}
  //     for (const param of inputParams){
  //       console.log("(emit new param page)param is: " + JSON.stringify(param));
  //       subscriber.next(param);
  //     }
  //     subscriber.complete();
  //  });

    let pageParms: Observable<any> = from(inputParams);

    //console.log("page params om getUsers: "+ JSON.stringify(inputParams) + (typeof inputParams) + ' ' + inputParams);
    let pageParamsObservable = from(pageParms);
    // need to combine pageParams with the http requests
    return pageParamsObservable.pipe(
      tap(
        pageParam => { console.log('page 2' + JSON.stringify(pageParam));
                        return this.getUsersPage(pageParam['first'], pageParam.max) }
      )
    );
  }
}

/*
a) get the total number of users
b) use to assemble an objservable
public sample(): Observable<any[]>
{
  let call1=this.http.get(this._url+'/v1/sample1')
  let call2=this.http.get(this._url+'/v1/sample2')
  let call3=this.http.get(this._url+'/v1/sample3')
  return forkJoin([call1, call2,call3]);
}

return that.

*/

interface pageParamModel {
  first: string,
  max: string
}


// manipulate data stream ideas:
// https://stackoverflow.com/questions/48801044/push-pop-items-from-observable