import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { ProfilePage } from '../profile/profile';
import { DomSanitizer } from '@angular/platform-browser';

/**
 * Generated class for the YtvideoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-ytvideo',
  templateUrl: 'ytvideo.html',
})
export class YtvideoPage {

  // videoUrl
  videoUrl: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl: ViewController, private dom: DomSanitizer) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad YtvideoPage');
    // get videoUrl
    this.videoUrl = this.navParams.get('videoUrl');
  }

  // closeModal
  closeModal() {
    this.viewCtrl.dismiss(ProfilePage);
  }

  // getVideoUrl
  getVideoUrl() {
    return this.dom.bypassSecurityTrustResourceUrl(this.videoUrl);
  }
}
