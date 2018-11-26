import { Injectable } from '@angular/core';
import { Device } from '@ionic-native/device';

@Injectable()
export class GlobalProvider {

  SITE_URL: string = 'http://ionic.dsl.house/heartAppApi';

  constructor(private device: Device) {
    console.log('Hello GlobalProvider Provider');
    this.uuid();
  }

  uuid() {
    return this.device.uuid;
  }

}
