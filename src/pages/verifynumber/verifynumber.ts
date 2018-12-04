import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Platform } from 'ionic-angular';
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
  country: number = null;
  mobileno: number = null;
  verficationCode: any;
  uuid: any;
  allCountries: any;
  loader: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController, private global: GlobalProvider, public platform: Platform, public userService: UserProvider, private storage: Storage) {

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
        if(element.code == this.code){
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
      console.log('Oops!'+err);
    });
  }

  // validateNumber
  validateNumber() {
    
    // check if country or number is empty give alert
    if(this.mobileno === null)
    {
      // create alert
      alert('please enter your number');
    }
    else
    {
      let mobileno = Number(this.mobileno);
      // check if mobileno is not a string then sendSMS
      if(!isNaN(mobileno))
      {
        // sendSMS
        this.sendSMS();
      }
      else{
        alert('Please enter valid number');
      }
      
    }
  }

  // getuniqueDeviceID
  getuniqueDeviceID() {
    if(this.global.uuid()) {
      this.uuid = this.global.uuid();
    }
    else{
      this.uuid = 'undefined';
    }
  }
  
  // sendSMS
  sendSMS() {

    // call createLoader
    this.createLoader();

    const data = {
      mobileno: this.mobileno,
      country: this.country,
      uuid: this.uuid
    };
    
    // verifyNumber
    this.userService.verifyNumber(data).subscribe(data => {
      this.verficationCode = data.data.verification_code;

      let userExists: any;
      // check if number already exists
      if(data.msg === 'update')
      {
        if(data.data.verification == 'notVerified') {
          userExists = 'false';
        }
        else{
          userExists = 'true';
        }        
      }else{
        userExists = 'false';
      }

      // check if verification code is null then show loader
      if(this.verficationCode !== null) 
      {        
        this.navCtrl.push(VerifycodePage, {
          phone: this.mobileno,
          country: this.country,
          code: this.verficationCode,
          userExists: userExists
        });
        this.loader.dismiss();
      } 
    }, err => {
      console.log(err);
      this.loader.dismiss();
    });
  }

  // createLoader
  createLoader() {
    this.loader = this.loadingCtrl.create({
      spinner: 'dots',
      content: 'Please wait...'
    });

    this.loader.present();
  }
}
