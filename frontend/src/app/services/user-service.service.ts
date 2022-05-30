import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { mergeMap, Observable, switchMap, toArray } from 'rxjs';
//import { AuthModule, LogLevel } from 'angular-auth-oidc-client';
import jwtDecode, { JwtPayload } from "jwt-decode";
//import { UrlSerializer,  } from '@angular/router';
import {OIDCUser} from '../components/user/user.model'
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class UserServiceService {
  oidcAccessToken!: string;
  httpHeader: HttpHeaders = new HttpHeaders();
  oidcURI: string = '';
  oidcAuthURI: string = '';
  first: number = 0;
  pagesize: number = 50;

  constructor(
    private http: HttpClient,
    public oidcSecurityService: OidcSecurityService) {
    this.oidcSecurityService.getAccessToken().subscribe((token) => {
      this.oidcAccessToken = token;
      var decodedToken = jwtDecode<JwtPayload>(this.oidcAccessToken);
      console.log("decodedToken " + this.oidcURI);

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

  getHeader() {
    /**
     * creates a header and attached the bearer token to allow for communication
     * with auth provider (keycloak)
     */
    const headerDict = {
      'Content-type': 'application/json',
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + this.oidcAccessToken
    };
    const httpHeads = new HttpHeaders(headerDict);
    return httpHeads;
  };

  getTotalUsers() {
    /**
     * call the keycloak requesting the total number of users in the
     * auth system
     */
    const httpHeads: HttpHeaders = this.getHeader();
    return this.http.get(this.oidcAuthURI + '/users/count',
      { "headers": httpHeads });
  }

  getPageParams() {
    /**
     * consumes the total users observable, and converts to an array
     * containing parameters that need to be sent to future requests
     */
    let totalUsers: any;
    //let myvar = firstValueFrom(this.getTotalUsers());
    let pageParams = this.getTotalUsers().pipe(
      switchMap((param) => {
        console.log("total users in keycloak: " + param)
        let userPageParams: pageParamModel[] = [];
        for (let x = 0; x <= param; x += this.pagesize) {
          userPageParams.push({ "first": x.toString(), "max": this.pagesize.toString() });
        }
        return userPageParams;
      })
    );
    return pageParams;
  }

  getUsersPage(first: string, max: string):  Observable<OIDCUser[]> {
    /**
     * makes individual requests using first / max as parameters that are
     * sent to the request
     */
    const httpHeads: HttpHeaders = this.getHeader();
    const params = new HttpParams()
      .set("first", first)
      .set("max", max);
    console.log('get user page params: ' + JSON.stringify(params) + ' ' + first)
    return this.http.get<OIDCUser[]>(this.oidcAuthURI + '/users', {
      "headers": httpHeads,
      "params": params
    });
  }

  getUsers(): Observable<OIDCUser[]> {
    /**
     * returns an observable stream that returns pages of data from the
     * keycloak api containing individual users.
     */
    let pageParamsObservable = this.getPageParams();
    return pageParamsObservable.pipe(
      mergeMap(
        pageParam => {
          console.log('page 2' + JSON.stringify(pageParam));
          return this.getUsersPage(pageParam['first'], pageParam.max)
        }
      )
    );
  }

  // getUsersOneList() {
  //   let pageParamsObservable = this.getPageParams();
  //   return pageParamsObservable.pipe(
  //     forkJoin(
  //       pageParam => {
  //         if (!pageObservables.length) {
  //           pageObservables = pageParam;
  //         } else {
  //           pageObservables = pageObservables.concat(pageParam);
  //         }
  //         console.log('page 2' + JSON.stringify(pageParam));
  //         pageObservables = pageObservables.concat(pageParam);
  //         return this.getUsersPage(pageParam['first'], pageParam.max)
  //       }
  //     )
  //   );
  // }


  getUsersStream() {
    /**
     * returns an observable stream that returns pages of data from the
     * keycloak api containing individual users.
     */
    let getUsers = this.getUsers();
    return getUsers.pipe(
      switchMap(
        (userList) => {
              let outList: OIDCUser[] = [];
              let singleValue: OIDCUser;
              //for (let x=0; x<userList.length; x++) {
              // userList.forEach( (singleValue: OIDCUser): void => {
              //   outList.push(singleValue);
              // });
              for (let singleValue of userList) {
                outList.push(singleValue);
              }
              return outList;
            }
      ),
      toArray()
    )
  }
}

interface pageParamModel {
  first: string,
  max: string
}


// manipulate data stream ideas:
// https://stackoverflow.com/questions/48801044/push-pop-items-from-observable

// combine multiple http streams
// https://coryrylan.com/blog/angular-multiple-http-requests-with-rxjs

// https://syntaxfix.com/question/5473/how-to-make-one-observable-sequence-wait-for-another-to-complete-before-emitting
//

// decent docs on rxjs operators
// https://indepth.dev/reference/rxjs/operators