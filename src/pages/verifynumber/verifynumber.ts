import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Platform, AlertController } from 'ionic-angular';
import { VerifycodePage } from '../verifycode/verifycode';
import { UserProvider } from '../../providers/user/user';
import { Storage } from '@ionic/storage';
import { GlobalProvider } from '../../providers/global/global';

/**
 * Generated class for the VerifynumberPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-verifynumber',
  templateUrl: 'verifynumber.html',
})
export class VerifynumberPage {

  // country
  code: string = 'US';
  country: number;
  mobileno: any = '';
  verficationCode: any;
  uuid: any;
  allCountries: any;
  loader: any;
  email: any = '';

  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController, private global: GlobalProvider, public platform: Platform, public userService: UserProvider, private storage: Storage, private alertCtrl: AlertController) {

    // call getuniqueDeviceID
    this.getuniqueDeviceID();

    // if user try goback then exit app
    this.platform.registerBackButtonAction(() => {
      platform.exitApp();
    });

    // call function createLoader
    this.createLoader();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VerifynumberPage');

    // call user service provider
    this.userService.getAllCountries().subscribe((country) => {
      this.allCountries = country;

      // GET COUNTRY DIAL CODE BY ITS CODE
      country.forEach(element => {
        if (element.code == this.code) {
          this.country = element.dial_code;
        }
      });

      // set a countries in storage
      this.storage.set('countries', this.allCountries);

      this.loader.dismiss();
    }, error => {
      console.log('Oops!');
      this.loader.dismiss();
    });

    // call function getCountryCode
    // this.getCountryCode(this.code);

  }

  // function to getCountryCode
  getCountryCode(code: string) {

    // call user service provider to get country code
    this.userService.getCountryCodeByCode(code).subscribe(data => {
      this.country = data.dial_code;

      // dismiss laoder
      this.loader.dismiss();
    }, err => {
      console.log('Oops!' + err);
    });
  }

  // validateData
  validateData() {
    // check if not empty email or number
    if (this.mobileno != '' && this.email != '') {      
      if(!Number(parseInt(this.mobileno))) {
        this.createAlert('Please enter valid number');
      }
      else if(this.validateEmail(this.email) == false) {
        this.createAlert('Please enter valid email');
      }
      else{
        this.sendSMS('both');
      }
    }
    else if(this.mobileno != '' && this.email == '') {
      if(!Number(parseInt(this.mobileno))) {
        this.createAlert('Please enter valid number');
      }
      else{
        this.sendSMS('mobileno');
      }
    }
    else if(this.email != '' && this.mobileno == '') {
      if(this.validateEmail(this.email) == false) {
        this.createAlert('Please enter valid email');
      }
      else{
        this.sendSMS('email');
      }
    }
    else if (this.mobileno == '' && this.email == ''){
      this.createAlert('Please enter your mobile number or email.');
    }
  }

  // getuniqueDeviceID
  getuniqueDeviceID() {
    if (this.global.uuid()) {
      this.uuid = this.global.uuid();
    }
    else {
      this.uuid = 'undefined';
    }
  }

  // sendSMS
  sendSMS(verification_type: string) {

    // call createLoader
    this.createLoader();

    const data = {
      mobileno: this.mobileno,
      country: this.country,
      email: this.email,
      verification_type: verification_type,
      uuid: this.uuid
    };

    // verifyNumber
    this.userService.verifyNumber(data).subscribe(data => {
      this.verficationCode = data.data.verification_code;

      let userExists: any;
      // check if number already exists
      if (data.msg === 'update') {
        if (data.data.verification == 'notVerified') {
          userExists = 'false';
        }
        else if(data.data.profile_status == 'notVerified') {
          userExists = 'false';
        }
        else{
          userExists = 'true';
        }
      } else {
        userExists = 'false';
      }

      // check if verification code is null then show loader
      if (this.verficationCode !== null) {
        this.navCtrl.push(VerifycodePage, {
          phone: this.mobileno,
          country: this.country,
          code: this.verficationCode,
          email: this.email,
          verification_type: verification_type,
          userExists: userExists
        });
        this.loader.dismiss();
      }
    }, err => {
      console.log(err);
      this.loader.dismiss();
    });
  }

  // createAlert
  createAlert(msg: string) {
    const alert = this.alertCtrl.create({
      message: msg,
      buttons: ['ok']
    });
    alert.present();
  }

  // createLoader
  createLoader() {
    this.loader = this.loadingCtrl.create({
      spinner: 'dots',
      content: 'Please wait...'
    });

    this.loader.present();
  }

  // validateEmail
  validateEmail(mail: string) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
      return true;
    }
    else {
      return false;
    }
  }
}
