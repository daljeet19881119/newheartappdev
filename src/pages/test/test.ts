import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-test',
  templateUrl: 'test.html',
})
export class TestPage {

  desc: string = "My heart rate and blood pressure drops almost immeditely, and within weeks my circulation and ability to breathe improve dramatically. I'll also look better. Smoking prematurely ages the skin, causes wrinkles!\n \n I want to be happy!";

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TestPage');
    
  }

}
