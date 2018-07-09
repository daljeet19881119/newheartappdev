import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Platform } from 'ionic-angular';
import { VerifycodePage } from '../verifycode/verifycode';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { UniqueDeviceID } from '@ionic-native/unique-device-id';
import { UserProvider } from '../../providers/user/user';
import { Storage } from '@ionic/storage';

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

  constructor(public navCtrl: NavController, public navParams: NavParams, private http: Http, public loadingCtrl: LoadingController, private uniqueDeviceID: UniqueDeviceID, public platform: Platform, public userService: UserProvider, private storage: Storage) {

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

      // set a countries in storage
      this.storage.set('countries', this.allCountries);
      
      // console.log(country);
    }, error => {
      console.log('Oops!');
    });
    
    // call function getCountryCode
    this.getCountryCode(this.code);

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
    this.uniqueDeviceID.get()
      .then((uuid: any) => {this.uuid = uuid;})
      .catch((error: any) => console.log(error));
  }
  
  // sendSMS
  sendSMS() {

    // call createLoader
    this.createLoader();

    // request data from server
    this.http.get('http://ionic.dsl.house/heartAppApi/verify-users.php?country='+this.country+'&mobileno='+this.mobileno+'&uuid='+this.uuid).map(res => res.json()).subscribe(data => {
      this.verficationCode = data.data.verification_code;
      console.log(data);

      let userExists: any;
      // check if number already exists
      if(data.msg === 'update')
      {
        userExists = 'true';
      }else{
        userExists = 'false';
      }

      // check if verification code is null then show loader
      if(this.verficationCode !== null) 
      {

        // push to verifycode page
        // const modal = this.modalCtrl.create(VerifycodePage,{
        //   phone: this.mobileno,
        //   country: this.country,
        //   code: this.verficationCode,
        //   userExists: userExists
        // });
        // modal.present();
        
        this.navCtrl.push(VerifycodePage, {
          phone: this.mobileno,
          country: this.country,
          code: this.verficationCode,
          userExists: userExists
        });
        this.loader.dismiss();
      } 
    }, err => {
      console.log('Oops!');
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
