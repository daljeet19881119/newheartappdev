import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { VerifynumberPage } from '../verifynumber/verifynumber';
import { UserProvider } from '../../providers/user/user';
import { UserinfoPage } from '../userinfo/userinfo';
import { HomePage } from '../home/home';
import { BhHomePage } from '../bh-home/bh-home';
import { GlobalProvider } from '../../providers/global/global';

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

  // gotoVerifyPage
  gotoVerifyPage() {
    setTimeout(() => {
      this.cleanStorage();
      this.navCtrl.setRoot(VerifynumberPage);
    }, 2000);
  }

  // requestData
  requestData(uuid: any) {
    this.userService.getUserByDeviceId(uuid).subscribe(data => {
      if (data.msg == 'success') {
        if (data.data.verification == 'unverified' && data.data.profile_status == 'unverified') {
          this.gotoVerifyPage();
        }
        if (data.data.verification == 'verified' && data.data.profile_status == 'unverified') {
          this.navCtrl.setRoot(UserinfoPage, {
            mobileno: data.data.mobileno,
            country: data.data.country,
            email: data.data.email,
            verification_type: data.data.verification_type
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
        this.gotoVerifyPage();
      }
    }, err => {
      this.gotoVerifyPage();
    });
  }

  // clean storage
  cleanStorage() {
    this.userService.cleanStorage();
  }
}
