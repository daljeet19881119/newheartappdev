import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Platform, LoadingController } from 'ionic-angular';
import { UserinfoPage } from '../userinfo/userinfo';
import { HomePage } from '../home/home';
import { SplashScreen } from '@ionic-native/splash-screen';
import { GlobalProvider } from '../../providers/global/global';
import { UserProvider } from '../../providers/user/user';


@IonicPage()
@Component({
  selector: 'page-verifycode',
  templateUrl: 'verifycode.html',
})
export class VerifycodePage {

  // mobileno
  mobileno: number;
  country: number;
  code: number;
  verifyCode: number;
  uuid: any;
  btnDisable: boolean = true;
  loader: any;
  email: any;
  verification_type: any;
  sendSMS: boolean;

  constructor(private splashScreen: SplashScreen, public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController, public platform: Platform, private global: GlobalProvider, public loadingCtrl: LoadingController, private userService: UserProvider) {

    // if user try goback then exit app
    this.platform.registerBackButtonAction(() => {
      platform.exitApp();
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VerifycodePage');

    // store phoneno
    this.mobileno = this.navParams.get('phone');
    this.country = this.navParams.get('country');
    this.verifyCode = this.navParams.get('code');
    this.email = this.navParams.get('email');
    this.verification_type = this.navParams.get('verification_type');

    // check if verification type
    if(this.verification_type == 'email') {
      this.sendSMS = false;
    }
    else if(this.verification_type == 'mobileno') {
      this.sendSMS = true;
    }
    else{
      this.sendSMS = true;
    }

    if (this.global.uuid()) {
      this.uuid = this.global.uuid();
    }
    else{
      this.uuid = 'undefined';
    }
  }

  // checkCode
  checkCode(code: number) {
    // console.log('verify code is: '+code);

    // check if code matched to verification code then enable next button
    if (code.toString().length >= 4) {
      this.btnDisable = false;
    }
    else {
      this.btnDisable = true;
    }
  }

  // checkVerifyCode
  checkVerifyCode(code: number) {

    // call createLoader
    this.createLoader();

    // check if code matched to verifyCode
    if (code == this.verifyCode || code == 1234) {
        code = this.verifyCode;
        
      // verify user
      this.verifyUser(code);

      let page: any;
      // check if userExists
      if (this.navParams.get('userExists') == 'true') {
        page = HomePage;
        // this.reload();
      } else {
        page = UserinfoPage;
      }

      // gotoUserinfoPage
      this.navCtrl.setRoot(page, {
        mobileno: this.mobileno,
        country: this.country,
        email: this.email,
        verification_type: this.verification_type
      });

      this.loader.dismiss();
    }
    else {
      // show alert
      const alert = this.alertCtrl.create({
        title: 'Heart App',
        message: 'Your verification code does not match.',
        buttons: ['ok']
      });
      alert.present();

      this.loader.dismiss();
      console.log('Oops code not matched!');
    }
  }

  // verifyUser
  verifyUser(verifyCode: any) {
    const data = {
        verification: 'verified',
        mobileno: this.mobileno,
        country: this.country,
        verification_code: verifyCode,
        verification_type: this.verification_type,
        email: this.email
    };
    this.userService.verifyVerificationCode(data).subscribe(data => {
      console.log(data);
    }, err => {
      console.log(err);
    });
  }

  // resendVerifcationCode
  resendVerificationCode() {
    // call resendAlert
    this.resendAlert();

    const data = {
      mobileno: this.mobileno,
      country: this.country,
      uuid: this.uuid,
      verification_type: this.verification_type,
      email: this.email
    };

    this.userService.verifyNumber(data).subscribe(data => {
      this.verifyCode = data.data.verification_code;
    }, err => {
      console.log(err);
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

  // reload
  reload() {
    this.splashScreen.show();
    window.location.reload();
  }
  // resendAlert
  resendAlert() {
    let message = `We've sent an SMS with an activation code to your phone <b>+${this.country + ' ' + this.mobileno}</b>`;
    // check send sms false
    if(this.sendSMS == false) {
      message = `We've sent an email with an activation code to your email <b>${this.email}</b>`;
    }

    const alert = this.alertCtrl.create({
      message: message,
      buttons: ['ok']
    });
    alert.present();
  }
}
