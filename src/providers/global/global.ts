import { Injectable } from '@angular/core';
import { Device } from '@ionic-native/device';

@Injectable()
export class GlobalProvider {

  SITE_URL: string = 'https://ionic.dsl.house/heartAppApi';
  API_URL: string = 'https://ionic.dsl.house/api/heartglobal';
  // API_URL: string = 'http://localhost/restserver/api/heartglobal';
  BASE_URL: string = "https://ionic.dsl.house/"
  // BASE_URL: string = "http://localhost/restserver/"

  constructor(private device: Device) {
    console.log('Hello GlobalProvider Provider');
    this.uuid();
  }

  uuid() {
    return this.device.uuid;
  }

  apiUrl(url: string) {
    return this.API_URL + url;
  }

  // baseUrl
  base_url(url: string) {
    return this.BASE_URL + url;
  }
}
