import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController, Platform, ViewController, LoadingController } from 'ionic-angular';
import { UserProvider } from '../../providers/user/user';

@IonicPage()
@Component({
  selector: 'page-charities',
  templateUrl: 'charities.html',
})
export class CharitiesPage {

  all_charities: any = [];
  loader: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, public alertCtrl: AlertController, public platform: Platform, private viewCtrl: ViewController, private userService: UserProvider, private loadingCtrl: LoadingController) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CharitiesPage');
    // crate loader
    this.createLoader("loading");

    // if charities comming from navparms
    if(this.navParams.get('charities').length > 0 && this.navParams.get('charities')) {
        this.all_charities = this.navParams.get('charities');
        this.loader.dismiss();
    }
    else{
      // get all charities
      this.userService.getAllCharities().subscribe(charities => {      
        charities.forEach(element => {
          element.value = false;
        });
        this.all_charities = charities;  
        this.loader.dismiss();
      }, err => {
        console.log(err);
        this.loader.dismiss();
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
      const alert = this.alertCtrl.create({
        title: 'HeartApp',
        message: 'Please select at least one charity type.',
        buttons: ['ok']
      });
      alert.present();
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

  // createLoader
  createLoader(msg: string) {
    this.loader = this.loadingCtrl.create({
      content: msg,
      spinner: 'dots'
    });
    this.loader.present();
  }
}
