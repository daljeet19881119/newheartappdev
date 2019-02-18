import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { HomePage } from '../home/home';


@IonicPage()
@Component({
  selector: 'page-thankyou-video',
  templateUrl: 'thankyou-video.html',
})
export class ThankyouVideoPage {

  // videoUrl
  videoUrl: string;
  
  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
    // get videoUrl
    this.videoUrl = this.navParams.get('videoUrl');
  }

  // closeModal
  closeModal() {
    this.viewCtrl.dismiss(HomePage);
  }
}
