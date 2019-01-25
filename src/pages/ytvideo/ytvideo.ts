import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { ProfilePage } from '../profile/profile';
import { DomSanitizer } from '@angular/platform-browser';
import { ScreenOrientation } from '@ionic-native/screen-orientation';


@IonicPage()
@Component({
  selector: 'page-ytvideo',
  templateUrl: 'ytvideo.html',
})
export class YtvideoPage {

  // videoUrl
  videoUrl: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl: ViewController, private dom: DomSanitizer, private screenOrientation: ScreenOrientation) {
    // get videoUrl
    this.videoUrl = this.navParams.get('videoUrl');
  }

  ionViewDidEnter() {
    // set to landscape
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE);
  }

  // closeModal
  closeModal() {
    // set to portrait
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);

    this.viewCtrl.dismiss(ProfilePage);
  }

  // getVideoUrl
  getVideoUrl() {
    return this.dom.bypassSecurityTrustResourceUrl(this.videoUrl);
  }
}
