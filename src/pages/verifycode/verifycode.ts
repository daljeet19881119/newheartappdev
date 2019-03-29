import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
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
  email: any;
  verification_type: any;
  sendSMS: boolean;

  constructor(private splashScreen: SplashScreen, public navCtrl: NavController, public navParams: NavParams, private global: GlobalProvider, private userService: UserProvider) {

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
    if (this.verification_type == 'email') {
      this.sendSMS = false;
    }
    else if (this.verification_type == 'mobileno') {
      this.sendSMS = true;
    }
    else {
      this.sendSMS = true;
    }

    if (this.global.uuid()) {
      this.uuid = this.global.uuid();
    }
    else {
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
    this.global.createLoader('Please wait...');

    // check if code matched to verifyCode (code == 1234)
    if (code == this.verifyCode) {
      code = this.verifyCode;

      // verify user
      this.verifyUser(code);
    }
    else {
      // show alert
      this.global.createAlert('Heart App', 'Your verification code does not match.');

      this.global.dismissLoader();
      console.log('Oops code not matched!');
    }
  }

  // verifyUser
  verifyUser(verifyCode: any) {
    const data = {
      verification: 'verified',
      mobile_no: this.mobileno,
      country_dial_code: this.country,
      verification_code: verifyCode,
      verification_type: this.verification_type,
      email: this.email
    };
    this.userService.verifyVerificationCode(data).subscribe(data => {
      let page: any;
      // check if userExists
      if (this.navParams.get('userExists') == 'true' && data.data.verification == 'verified' && data.data.profile_status == 'verified') {
        page = HomePage;
      } else {
        page = UserinfoPage;
      }

      // gotoUserinfoPage
      this.navCtrl.setRoot(page, {
        mobileno: this.mobileno,
        country: this.country,
        email: this.email,
        verification_type: this.verification_type,
        user_id: data.data.user_id
      });

      this.global.dismissLoader();
    }, err => {
      console.log(err);
    });
  }

  // resendVerifcationCode
  resendVerificationCode() {
    // call resendAlert
    this.resendAlert();

    const data = {
      mobile_no: this.mobileno,
      country_dial_code: this.country,
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

  // reload
  reload() {
    this.splashScreen.show();
    window.location.reload();
  }
  // resendAlert
  resendAlert() {
    let message = `We've sent an SMS with an activation code to your phone <b>+${this.country + ' ' + this.mobileno}</b>`;
    // check send sms false
    if (this.sendSMS == false) {
      message = `We've sent an email with an activation code to your email <b>${this.email}</b>`;
    }

    this.global.createAlert('', message);
  }
}
