import { Injectable } from '@angular/core';
import { Device } from '@ionic-native/device';
import { LoadingController, AlertController } from 'ionic-angular';

@Injectable()
export class GlobalProvider {

  SITE_URL: string = 'https://ionic.dsl.house/heartAppApi';
  API_URL: string = 'https://ionic.dsl.house/dev/api/heartglobal';
  // API_URL: string = 'https://ionic.dsl.house/api/heartglobal';
  // API_URL: string = 'http://localhost/dsl.house/api/heartglobal';
  BASE_URL: string = "https://ionic.dsl.house/dev/";
  // BASE_URL: string = "https://ionic.dsl.house/";
  // BASE_URL: string = "http://localhost/dsl.house/";

  loader: any
  constructor(private device: Device, public loadingCtrl: LoadingController, public alertCtrl: AlertController) {
    console.log('Hello GlobalProvider Provider');
    this.uuid();
  }

  uuid() {
    if(this.device.uuid) {
      return this.device.uuid;
    }
    else{
      return 'undefined';
    }   
  }

  apiUrl(url: string) {
    return this.API_URL + url;
  }

  // baseUrl
  base_url(url: string) {
    return this.BASE_URL + url;
  }

  // createLoader
  createLoader(msg?: string) {
    this.loader = this.loadingCtrl.create({
      content: msg,
      spinner: 'dots'
    });
    this.loader.present();
  }

  // createAlert
  createAlert(title: string, msg: string) {
    const alert = this.alertCtrl.create({
      title: title,
      message: msg,
      buttons: ['ok']
    });
    alert.present();
  }

  // dismissLoader
  dismissLoader() {
    this.loader.dismiss();
  }
}
