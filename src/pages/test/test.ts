import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the TestPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-test',
  templateUrl: 'test.html',
})
export class TestPage {

  input: number = 100;
  max: number = 1000;
  sectors: any = [{
    from: 0,
    to: 500,
    color: 'orange'
  }, {
    from: 500,
    to: 1000,
    color: 'red'
  }];

  disablePlusBtn: boolean;
  disableMinusBtn: boolean;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TestPage');
    if(this.input < 25) {
      this.disableMinusBtn = true;
      this.disablePlusBtn = false;
    }
    if(this.input > 950) {
      this.disableMinusBtn = false;
      this.disablePlusBtn = true;
    }
  }

  incrementVal() {    
    if(this.input < 500) {
      this.input = this.input + 25;
    }
    else if(this.input >= 500 && this.input <= 950) {
      this.input = this.input + 50;
    }

    if(this.input > 25 && this.input < 950) {
      this.disableMinusBtn = false;
      this.disablePlusBtn = false;
    }
    else if(this.input > 950) {
      this.disablePlusBtn = true;
      this.disableMinusBtn = false;
    }
    
    console.log('input: '+this.input);
  }

  decrementVal() {
    if(this.input <= 500) {
      this.input = this.input - 25;
    }
    else if(this.input > 500 && this.input <= 1000) {
      this.input = this.input - 50;
    }

    if(this.input > 25 && this.input < 1000) {
      this.disableMinusBtn = false;
      this.disablePlusBtn = false;
    }
    else if(this.input <= 25) {
      this.disablePlusBtn = false;
      this.disableMinusBtn = true;
    }   

    console.log('input: '+this.input);
  }
}
