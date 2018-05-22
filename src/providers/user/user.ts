import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
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

  // getUserByDeviceId
  getUserByDeviceId(uuid: any) {
    return this._http.get('http://ionic.dsl.house/heartAppApi/get-verified-user.php?uuid='+uuid).map(res => res.json());
  }
}
