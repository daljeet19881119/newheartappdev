import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the CommunityPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-community',
  templateUrl: 'community.html',
})
export class CommunityPage {

  founderName: string = '';
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.founderName = this.navParams.get('founderName');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CommunityPage');
  }

}
