import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';
import { GlobalProvider } from '../global/global';

/*
  Generated class for the UserProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UserProvider {

  constructor(public httpClient: HttpClient, private _http: Http, private storage: Storage, private global: GlobalProvider) {
  }

  
  // getAllCountries
  getAllCountries() {
    return this._http.get(this.global.SITE_URL + '/all-countries.php').map(res => res.json());
  }

  // getAllRegions
  getAllRegions() {
    return this._http.get(this.global.SITE_URL + '/all-regions.php').map(res => res.json());
  }

  // getAllCharities
  getAllCharities() {
    return this._http.get(this.global.SITE_URL + '/all-charities.php').map(res => res.json());
  }

  getNgoByCharityIds(charity_ids: any) {
    // set headers
    let headers = new Headers();    
    headers.append("Accept", 'application/json');
    
    // set request option
    let options = new RequestOptions({ headers: headers });

    // set data to be send
    let data = JSON.stringify({
        charities: charity_ids
    });
    return this._http.post(this.global.SITE_URL + '/get-ngo.php', data, options).map(res => res.json());
  }

  // getRegionNameById
  getRegionNameById(regionId: any) {

    return this._http.get(this.global.SITE_URL + '/get-region.php?id='+regionId).map(res => res.json());
  }

  // getCountryCodeByCode
  getCountryCodeByCode(code: string) {
    return this._http.get(this.global.SITE_URL + '/all-countries.php?code='+code).map(res => res.json());
  }

  // getUserByDeviceId
  getUserByDeviceId(uuid: any) {
    return this._http.get(this.global.SITE_URL + '/get-verified-user.php?uuid='+uuid).map(res => res.json());
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

    return this._http.post(this.global.SITE_URL + '/users-bighearts.php', data, options).map(res => res.json());
    // return this._http.get('http://ionic.dsl.house/heartAppApi/users-bighearts.php?uuid='+uuid+'&ngo_id='+ngo_id).map(res => res.json());
  }

  // checkInMyBigHearts
  checkInMyBigHearts(uuid: any, ngo_id: any) {
    return this._http.get(this.global.SITE_URL + '/get-users-bighearts.php?uuid='+uuid+'&ngo_id='+ngo_id).map(res => res.json());
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

    return this._http.post(this.global.SITE_URL + "/delete-users-bighearts.php", data, options).map(res => res.json());
  }

  // saveCauseFormData
  saveCauseFormData(userid: number, fname: string, lname: string, email: string, bank_name: string, account_no: any, ifsc_code: any, paypal_email:any, cause_category: any, country: any, region: any, city: string, fewAboutYourself: string, moreAboutYourself: string, profilePicName: string, multiplePics: any,  contact1: string, contact2: string, contact3: string, contact4: string, contact5: string) {

    // set headers
    let headers = new Headers();
    headers.append("Accept","application/json");

    // set request option
    let options = new RequestOptions({headers: headers});

    // set data to be send
    let data = JSON.stringify({
        userid: userid,
        fname: fname,
        lname: lname,
        email: email,
        bank_name: bank_name,
        account_no: account_no,
        ifsc_code: ifsc_code,
        paypal_email: paypal_email,
        cause_category: cause_category,
        country: country,
        region: region,
        city: city,
        fewAboutYourself: fewAboutYourself,
        moreAboutYourself: moreAboutYourself,
        profilePic: profilePicName,
        multiplePics: multiplePics,
        contact1: contact1,
        contact2: contact2,
        contact3: contact3,
        contact4: contact4,
        contact5: contact5
    });

    return this._http.post(this.global.SITE_URL + "/cause-form.php", data, options).map(res => res.json());
  }

  // saveMerchantFormData
  saveMerchantFormData(userid: number, fname: string, lname: string, short_desc: string, aboutTeam: string) {

      // set headers
      let headers = new Headers();
      headers.append("Accept", "application/json");

      // set request option
      let options = new RequestOptions({headers: headers});

      // set data to be send
      let data = JSON.stringify({
          userid: userid,
          fname: fname,
          lname: lname,
          short_desc: short_desc,
          about_team: aboutTeam
      });

      return this._http.post(this.global.SITE_URL + "/merchant-form.php", data, options).map(res => res.json());
  }

  // saveVolunteerFormData
  saveVolunteerFormData(userid: number, fname: string, lname: string, email: string, charity: any, volunteerLocation: string, fewAboutYourself: string, moreAboutYourself: string, profilePicName: string, contact1: string, contact2: string, contact3: string, contact4: string, contact5: string) {

      // set headers
      let headers = new Headers();
      headers.append("Accept", "application/json");

      // set request option
      let options = new RequestOptions({headers: headers});

      // set data to be send
      let data = JSON.stringify({
        userid: userid,
        fname: fname,
        lname: lname,
        email: email,
        charity: charity,
        volunteerLocation: volunteerLocation,
        fewAboutYourself: fewAboutYourself,
        moreAboutYourself: moreAboutYourself,
        profilePic: profilePicName,
        contact1: contact1,
        contact2: contact2,
        contact3: contact3,
        contact4: contact4,
        contact5: contact5
      });

      return this._http.post(this.global.SITE_URL + "/volunteer-form.php", data, options).map(res => res.json());
  }

  // clean storage
  cleanStorage() {
    this.storage.clear().then(() => {
      console.log('all keys cleared');
    });
  }

  // saveUserBighearts
  saveUserBighearts(ngo_ids: any, uuid: any) {
    // set headers
    let headers = new Headers();
    headers.append("Accept", "application/json");

    // set request option
    let options = new RequestOptions({headers: headers});

    // set data to be send
    let data = JSON.stringify({
        ngo_ids: ngo_ids,
        uuid: uuid
    });

    return this._http.post(this.global.SITE_URL + "/save-user-bighearts.php", data, options).map(res => res.json());
  }
}
