import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { UniqueDeviceID } from '@ionic-native/unique-device-id';

/*
  Generated class for the UserProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UserProvider {

  uuid: any = null;

  constructor(public httpClient: HttpClient, private _http: Http, private uniqueDeviceID: UniqueDeviceID) {
    console.log('Hello UserProvider Provider');
  }

  
  // getAllCountries
  getAllCountries() {
    return this._http.get('http://ionic.dsl.house/heartAppApi/all-countries.php').map(res => res.json());
  }

  // getUserByDeviceId
  getUserByDeviceId() {
    return this._http.get('http://ionic.dsl.house/heartAppApi/get-verified-user.php?uuid='+this.uuid).map(res => res.json());
  }

  // getDeviceID
  getDeviceID() {
    this.uniqueDeviceID.get()
      .then((uuid: any) => {
        this.uuid = uuid;  
      })
      .catch((error: any) => {
        console.log(error);
      });
  }
}
