import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UserProvider } from '../../providers/user/user';
import { UserinfoPage } from '../userinfo/userinfo';
import { HomePage } from '../home/home';
import { BhHomePage } from '../bh-home/bh-home';
import { GlobalProvider } from '../../providers/global/global';
import { SigninPage } from '../signin/signin';

@IonicPage()
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html',
})
export class WelcomePage {

  uuid: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, private userService: UserProvider, private global: GlobalProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WelcomePage');

    // check if true uuuid
    if (this.global.uuid()) {
      this.uuid = this.global.uuid();
    }
    else {
      this.uuid = 'undefined';
    }
    // call requestData
    this.requestData(this.uuid);
  }

  // gotoLoginPage
  gotoLoginPage() {
    setTimeout(() => {
      this.cleanStorage();
      this.navCtrl.setRoot(SigninPage);
    }, 2000);
  }

  // requestData
  requestData(uuid: any) {
    this.userService.getUserByDeviceId(uuid).subscribe(data => {
      if (data.msg == 'success') {
        if (data.data.verification == 'unverified' && data.data.profile_status == 'unverified') {
          this.gotoLoginPage();
        }
        if (data.data.verification == 'verified' && data.data.profile_status == 'unverified') {
          this.navCtrl.setRoot(UserinfoPage, {
            mobileno: data.data.mobile_no,
            country: data.data.country_dial_code,
            email: data.data.email,
            verification_type: data.data.verification_type,
            user_id: data.data.user_id
          });
        }
        if (data.data.verification == 'verified' && data.data.profile_status == 'verified') {
         
          // check if user is bigheart or not
          if (data.data.user_type == 'bh_user') {
            this.navCtrl.setRoot(BhHomePage);
          }
          else {
            this.navCtrl.setRoot(HomePage);
          }
        }
      }
      if (data.length < 1) {
        this.gotoLoginPage();
      }
    }, err => {
      this.gotoLoginPage();
    });
  }

  // clean storage
  cleanStorage() {
    this.userService.cleanStorage();
  }
}
