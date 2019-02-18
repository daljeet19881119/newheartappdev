import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { GlobalProvider } from '../../providers/global/global';
import { UserProvider } from '../../providers/user/user';

@IonicPage()
@Component({
  selector: 'page-forgot-password',
  templateUrl: 'forgot-password.html',
})
export class ForgotPasswordPage {

  email: string = "";
  constructor(public navCtrl: NavController, public navParams: NavParams, public global: GlobalProvider, private userService: UserProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ForgotPasswordPage');
  }

  // sendMail
  sendMail() {
    if(this.email == "") {
      this.global.createAlert("","Please fill the email.");
    }
    else{
      this.userService.sendMail(this.email).subscribe(data => {
          if(data.length < 1) {
            this.global.createAlert("","We did not found your email. Please type the registered email.");
          }
          if(data.msg == "success") {
            this.global.createAlert("","We have send the password to your email.");
          }
          this.email = "";
      });
    }
  }
}
