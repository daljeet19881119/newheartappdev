import { Injectable } from '@angular/core';
import { Device } from '@ionic-native/device';

@Injectable()
export class GlobalProvider {

  SITE_URL: string = 'https://ionic.dsl.house/heartAppApi';
  API_URL: string = 'https://ionic.dsl.house/api/heartapp';

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
}
