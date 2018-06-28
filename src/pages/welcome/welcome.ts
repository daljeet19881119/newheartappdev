import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { VerifynumberPage } from '../verifynumber/verifynumber';
import { UserProvider } from '../../providers/user/user';

/**
 * Generated class for the WelcomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html',
})
export class WelcomePage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private modalCtrl: ModalController, private userService: UserProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WelcomePage');
  }

  // gotoVerifyPage
  gotoVerifyPage() {
    const modal =  this.modalCtrl.create(VerifynumberPage);
    modal.present();
  }

  
  // clean storage
  cleanStorage() {
    this.userService.cleanStorage();
  }
}
