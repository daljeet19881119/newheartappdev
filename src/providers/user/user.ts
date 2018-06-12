import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the UserProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UserProvider {

  constructor(public httpClient: HttpClient, private _http: Http) {
  }

  
  // getAllCountries
  getAllCountries() {
    return this._http.get('http://ionic.dsl.house/heartAppApi/all-countries.php').map(res => res.json());
  }

  // getCountryCodeByCode
  getCountryCodeByCode(code: string) {
    return this._http.get('http://ionic.dsl.house/heartAppApi/all-countries.php?code='+code).map(res => res.json());
  }

  // getUserByDeviceId
  getUserByDeviceId(uuid: any) {
    return this._http.get('http://ionic.dsl.house/heartAppApi/get-verified-user.php?uuid='+uuid).map(res => res.json());
  }

  // addToMyBigHearts
  addToMyBigHearts(uuid: any, ngo_id: any) {
    
    // set headers
    let headers = new Headers();    
    headers.append("Accept", 'application/json');
    
    // set request option
    let options = new RequestOptions({ headers: headers });

    // set data to be send
    let data = JSON.stringify({
        uuid: uuid,
        ngo_id: ngo_id
    });

    return this._http.post('http://ionic.dsl.house/heartAppApi/users-bighearts.php', data, options).map(res => res.json());
    // return this._http.get('http://ionic.dsl.house/heartAppApi/users-bighearts.php?uuid='+uuid+'&ngo_id='+ngo_id).map(res => res.json());
  }

  // checkInMyBigHearts
  checkInMyBigHearts(uuid: any, ngo_id: any) {
    return this._http.get('http://ionic.dsl.house/heartAppApi/get-users-bighearts.php?uuid='+uuid+'&ngo_id='+ngo_id).map(res => res.json());
  }

  // removeFromMyBigHearts
  removeFromMyBigHearts(uuid: any, ngo_id: any) {

    // set headers
    let headers = new Headers();
    headers.append("Accept","application/json");

    // set request option
    let options = new RequestOptions({headers: headers});

    // set data to be send
    let data = JSON.stringify({
        uuid: uuid,
        ngo_id: ngo_id
    });

    return this._http.post("http://ionic.dsl.house/heartAppApi/delete-users-bighearts.php", data, options).map(res => res.json());
  }
}
