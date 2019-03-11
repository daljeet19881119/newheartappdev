import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';
import { GlobalProvider } from '../global/global';

@Injectable()
export class UserProvider {

  constructor(private _http: Http, private storage: Storage, private global: GlobalProvider) {
  }


  // getAllCountries
  getAllCountries() {
    return this._http.get(this.global.apiUrl('/all_countries')).map(res => res.json());
  }

  // getAllRegions
  getAllRegions() {
    return this._http.get(this.global.apiUrl('/all_regions')).map(res => res.json());
  }

  // getAllCharities
  getAllCharities() {
    return this._http.get(this.global.apiUrl('/all_charities')).map(res => res.json());
  }

  getBHByCharityIds(charity_ids: any) {
    // set headers
    let headers = new Headers();
    headers.append("Accept", 'application/json');

    // set request option
    let options = new RequestOptions({ headers: headers });

    // set data to be send
    let data = JSON.stringify({
      charities: charity_ids
    });

    return this._http.post(this.global.apiUrl('/get_bh_by_charity'), data, options).map(res => res.json());
  }

  // getRegionNameById
  getRegionById(regionId: any) {
    return this._http.get(this.global.apiUrl('/all_regions/' + regionId)).map(res => res.json());
  }

  // getCountryCodeByCode
  getCountryCodeByCode(code: string) {
    return this._http.get(this.global.apiUrl('/all_countries/' + code)).map(res => res.json());
  }

  // getUserByDeviceId
  getUserByDeviceId(uuid: any) {
    return this._http.get(this.global.apiUrl('/get_user/' + uuid)).map(res => res.json());
  }

  // get_user_by_id
  getUserById(user_id: any) {
    return this._http.get(this.global.apiUrl('/get_user_by_id/'+user_id)).map(res => res.json());
  }

  // getVerifiedUserByUUID
  getBigheartUserByDeviceId(uuid: any) {
    return this._http.get(this.global.apiUrl('/get_bigheart_user/' + uuid)).map(res => res.json());
  }

  // verifyNumber
  verifyNumber(data: any) {
    // set headers
    let headers = new Headers();
    headers.append("Accept", 'application/json');

    // set request option
    let options = new RequestOptions({ headers: headers });

    // set data to be send
    let postdata = JSON.stringify({
      data: data
    });

    return this._http.post(this.global.apiUrl('/verify_number'), postdata, options).map(res => res.json());
  }

  // verifyVerificationCode
  verifyVerificationCode(data: any) {
    // set headers
    let headers = new Headers();
    headers.append("Accept", 'application/json');

    // set request option
    let options = new RequestOptions({ headers: headers });

    // set data to be send
    let postdata = JSON.stringify({
      data: data
    });

    return this._http.post(this.global.apiUrl('/verify_verification_code'), postdata, options).map(res => res.json());
  }

  // verifyUserProfile
  verifyUserProfile(data: any) {
    // set headers
    let headers = new Headers();
    headers.append("Accept", 'application/json');

    // set request option
    let options = new RequestOptions({ headers: headers });

    // set data to be send
    let postdata = JSON.stringify({
      data: data
    });

    return this._http.post(this.global.apiUrl('/verify_user_profile'), postdata, options).map(res => res.json());
  }

  // makePayment
  makePayment(data: any) {
    // set headers
    let headers = new Headers();
    headers.append("Accept", 'application/json');

    // set request option
    let options = new RequestOptions({ headers: headers });

    // set data to be send
    let postdata = JSON.stringify({
      data: data
    });

    return this._http.post(this.global.apiUrl('/squarePayment'), postdata, options).map(res => res.json());
  }

  // addToMyBigHearts
  addToMyBigHearts(data: any) {

    // set headers
    let headers = new Headers();
    headers.append("Accept", 'application/json');

    // set request option
    let options = new RequestOptions({ headers: headers });

    // set data to be send
    let postdata = JSON.stringify({
      data: data
    });

    return this._http.post(this.global.apiUrl('/add_user_bighearts'), postdata, options).map(res => res.json());
  }

  // checkInMyBigHearts
  checkInUserBigHearts(user_id: any, bh_id: any) {
    return this._http.get(this.global.apiUrl('/get_user_bighearts/' + user_id + '/' + bh_id)).map(res => res.json());
  }

  // removeFromMyBigHearts
  removeFromMyBigHearts(data: any) {

    // set headers
    let headers = new Headers();
    headers.append("Accept", "application/json");

    // set request option
    let options = new RequestOptions({ headers: headers });

    // set data to be send
    let postdata = JSON.stringify({
      data: data
    });

    return this._http.post(this.global.apiUrl('/remove_user_bighearts'), postdata, options).map(res => res.json());
  }

  // saveCauseFormData
  saveCauseFormData(data: any) {

    // set headers
    let headers = new Headers();
    headers.append("Accept", "application/json");

    // set request option
    let options = new RequestOptions({ headers: headers });

    // set data to be send
    let postdata = JSON.stringify({
      data: data
    });

    return this._http.post(this.global.apiUrl('/cause_form'), postdata, options).map(res => res.json());
  }

  // saveMerchantFormData
  saveMerchantFormData(data: any) {

    // set headers
    let headers = new Headers();
    headers.append("Accept", "application/json");

    // set request option
    let options = new RequestOptions({ headers: headers });

    // set data to be send
    let postdata = JSON.stringify({
      data: data
    });

    return this._http.post(this.global.apiUrl('/merchant_form'), postdata, options).map(res => res.json());
  }

  // saveVolunteerFormData
  saveVolunteerFormData(data: any) {

    // set headers
    let headers = new Headers();
    headers.append("Accept", "application/json");

    // set request option
    let options = new RequestOptions({ headers: headers });

    // set data to be send
    let postdata = JSON.stringify({
      data: data
    });

    return this._http.post(this.global.apiUrl('/volunteer_form'), postdata, options).map(res => res.json());
  }

  // clean storage
  cleanStorage() {
    this.storage.clear().then(() => {
      console.log('all keys cleared');
    });
  }

  // saveUserBighearts
  saveUserBighearts(data: any) {
    // set headers
    let headers = new Headers();
    headers.append("Accept", "application/json");

    // set request option
    let options = new RequestOptions({ headers: headers });

    // set data to be send
    let postdata = JSON.stringify({
      data: data
    });

    return this._http.post(this.global.apiUrl('/save_user_bighearts'), postdata, options).map(res => res.json());
  }

  // updateUserInfo
  updateUserInfo(data: any) {
    // set headers
    let headers = new Headers();
    headers.append("Accept", "application/json");

    // set request option
    let options = new RequestOptions({ headers: headers });

    // set data to be send
    let postdata = JSON.stringify({
      data: data
    });

    return this._http.post(this.global.apiUrl('/update_user_info'), postdata, options).map(res => res.json());
  }

  // sendVerificationCode
  sendVerificationCode(data: any) {
    // set headers
    let headers = new Headers();
    headers.append("Accept", "application/json");

    // set request option
    let options = new RequestOptions({ headers: headers });

    // set data to be send
    let postdata = JSON.stringify({
      data: data
    });

    return this._http.post(this.global.apiUrl('/sendVerificationCode'), postdata, options).map(res => res.json());
  }

  // sendVerificationEmail
  sendVerificationEmail(data: any) {
    // set headers
    let headers = new Headers();
    headers.append("Accept", "application/json");

    // set request option
    let options = new RequestOptions({ headers: headers });

    // set data to be send
    let postdata = JSON.stringify({
      data: data
    });

    return this._http.post(this.global.apiUrl('/sendVerificationEmail'), postdata, options).map(res => res.json());
  }

  // getAllBHOfUser
  getAllBHOfUser(user_id: any) {
    return this._http.get(this.global.apiUrl('/getAllBHOfUser/'+user_id)).map(res => res.json());
  }

  // logout user
  logout(uuid: any) {
    // set headers
    let headers = new Headers();
    headers.append("Accept", "application/json");

    // set request option
    let options = new RequestOptions({ headers: headers });

    // set data to be send
    let postdata = JSON.stringify({
      uuid: uuid
    });

    return this._http.post(this.global.apiUrl('/logout'), postdata, options).map(res => res.json());
  }

  // login user
  login(data: any) {
    // set headers
    let headers = new Headers();
    headers.append("Accept", "application/json");

    // set request option
    let options = new RequestOptions({ headers: headers });

    // set data to be send
    let postdata = JSON.stringify({
      data: data
    });

    return this._http.post(this.global.apiUrl('/login'), postdata, options).map(res => res.json());
  }

  // send forgot mail
  sendMail(email: string) {
    // set headers
    let headers = new Headers();
    headers.append("Accept", "application/json");

    // set request option
    let options = new RequestOptions({ headers: headers });

    // set data to be send
    let postdata = JSON.stringify({
      email: email
    });

    return this._http.post(this.global.apiUrl('/forgotPassword'), postdata, options).map(res => res.json());
  }

  // update password
  updatePassword(data: any) {
    // set headers
    let headers = new Headers();
    headers.append("Accept", "application/json");

    // set request option
    let options = new RequestOptions({ headers: headers });

    // set data to be send
    let postdata = JSON.stringify({
      data: data
    });

    return this._http.post(this.global.apiUrl('/updatePassword'), postdata, options).map(res => res.json());
  }
}
