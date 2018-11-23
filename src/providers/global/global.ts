import { Injectable } from '@angular/core';
import { Device } from '@ionic-native/device';

@Injectable()
export class GlobalProvider {

  constructor(private device: Device) {
    console.log('Hello GlobalProvider Provider');
    this.uuid();
  }

  uuid() {
    return this.device.uuid;
  }
}
