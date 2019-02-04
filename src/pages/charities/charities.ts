import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Platform, ViewController } from 'ionic-angular';
import { UserProvider } from '../../providers/user/user';
import { GlobalProvider } from '../../providers/global/global';

@IonicPage()
@Component({
  selector: 'page-charities',
  templateUrl: 'charities.html',
})
export class CharitiesPage {

  all_charities: any = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, public platform: Platform, private viewCtrl: ViewController, private userService: UserProvider, public global: GlobalProvider) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CharitiesPage');
    // crate loader
    this.global.createLoader("loading");

    // if charities comming from navparms
    if(this.navParams.get('charities').length > 0 && this.navParams.get('charities')) {
        this.all_charities = this.navParams.get('charities');
        this.global.dismissLoader();
    }
    else{
      // get all charities
      this.userService.getAllCharities().subscribe(charities => {      
        charities.forEach(element => {
          element.value = false;
        });
        this.all_charities = charities;  
        this.global.dismissLoader();
      }, err => {
        console.log(err);
        this.global.dismissLoader();
      }); 
    }
             
  }

  // getSelectedCharity
  getSelectedCharity(id: string, name: string, value: boolean) {    
    console.log('id: ' +id+ ', name: ' + name+', value:'+value );
  }

  // toggleValue() 
  toggleValue(id: string) {
    this.all_charities.forEach(element => {
        if(element.id == id) {
          element.value = !element.value;
        }
    });
  }

  // gotoUserinfoPage
  gotoUserinfoPage() {
    let count = 0;
    
    this.all_charities.forEach(element => {
        if(element.value == true) {
          count++;
        }
    });

    // check if none of charities selected then show alert
    if (count == 0) {
      // create alert
      this.global.createAlert('HeartApp','Please select at least one charity type.');
    }
    else {

      // check if request from userinfo page then gotouserinfo page
      if (this.navParams.get('page') == 'userinfo') {
        this.viewCtrl.dismiss({
          charities: this.all_charities
        });
      }

      // check if request from causeForm page then gotocauseform page
      if (this.navParams.get('page') == 'cause-form') {
        this.viewCtrl.dismiss({
          charities: this.all_charities
        });
      }

      // check if request from volunteerform page then gotovolunteerform page
      if (this.navParams.get('page') == 'volunteer-form') {
        this.viewCtrl.dismiss({
          charities: this.all_charities,
        });
      }

      // check if request from Settings page then goto setting apge
      if(this.navParams.get('page') == 'settings') {
        this.viewCtrl.dismiss({
          charities: this.all_charities
        });
      }
    }
  }
}
