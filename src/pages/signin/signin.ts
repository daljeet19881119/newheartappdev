import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { GlobalProvider } from '../../providers/global/global';
import { UserProvider } from '../../providers/user/user';
import { BhHomePage } from '../bh-home/bh-home';
import { HomePage } from '../home/home';
import { FCM } from '@ionic-native/fcm';
import { VerifynumberPage } from '../verifynumber/verifynumber';
import { ForgotPasswordPage } from '../forgot-password/forgot-password';


@IonicPage()
@Component({
  selector: 'page-signin',
  templateUrl: 'signin.html',
})
export class SigninPage {

  email: string = "";
  password: string = "";
  constructor(public navCtrl: NavController, public navParams: NavParams, private global: GlobalProvider, private userService: UserProvider, private fcm: FCM, private platform: Platform) {

  }

  ionViewDidLoad() {
    // exit app on back button click
    this.platform.registerBackButtonAction(() => {
      this.platform.exitApp();
    });
  }

  // getToken
  getToken() {
    this.fcm.getToken().then(token => {
      return token;
    });
  }

  // signin
  signin() {
    if(this.email == "" || this.password == "") {
      this.global.createAlert('', "Please fill both email and password.");
    }
    else{
      const token = this.getToken();
      const data = {
        email: this.email,
        password: this.password,
        uuid: this.global.uuid(),
        token: (token == null) ? "" : token
      }; 
      // call loader
      this.global.createLoader("Signing In");
      this.userService.login(data).subscribe(response => {
          if(response.length < 1) {
            this.global.createAlert('', "Either your email or password is incorrect.");
          }        
          // check if user is bigheart or not
          if (response.user_type == 'bh_user') {
			// store user id in globall 
			this.global.SetUserId(response.user_id);  
            this.navCtrl.setRoot(BhHomePage);
          }
          if (response.user_type == 'user') {
			// store user id in globall 
			this.global.SetUserId(response.user_id); 
            this.navCtrl.setRoot(HomePage);
          }
          this.global.dismissLoader();
      });
    }    
  }

  // register
  register() {
    this.navCtrl.push(VerifynumberPage);
  }

  // forgotPassword
  forgotPassword() {
    this.navCtrl.push(ForgotPasswordPage);
  }
}
