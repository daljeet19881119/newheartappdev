import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, Platform } from 'ionic-angular';
import { UserProvider } from '../../providers/user/user';
import { Storage } from '@ionic/storage';
import { HomePage } from '../home/home';
import { GlobalProvider } from '../../providers/global/global';

/**
 * Generated class for the MerchantFormPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-merchant-form',
  templateUrl: 'merchant-form.html',
})
export class MerchantFormPage {

  fname: string;
  lname: string;
  shortDesc: string;
  aboutTeam: string;

  loader: any;
  userid: any;
  uuid: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private userService: UserProvider, public alertCtrl: AlertController, public loadingCtrl: LoadingController, private global: GlobalProvider, private storage: Storage, private platform: Platform) {

    // get data from storage
    this.storage.get('merchantForm').then((val) => {
      this.fname = val.fname;
      this.lname = val.lname;
      this.shortDesc = val.shortDesc;
      this.aboutTeam = val.aboutTeam;
    }).catch((err) => {
      console.log(err);
    });

    // get device id
    this.getDeviceID();

    // if user try goback then go to homepage
    this.platform.registerBackButtonAction(() => {
      this.navCtrl.push(HomePage);
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MerchantFormPage');


  }

  // getDeviceID
  getDeviceID() {
    if (this.global.uuid()) {
      this.uuid = this.global.uuid();

      // request to userProvide
      this.userService.getUserByDeviceId(this.uuid).subscribe(data => {
        this.userid = data.data.id;
      }, err => {
        console.log(err);
      });
    }
    else{
      this.uuid = 'undefined';
    }
  }

  // saveData
  saveData() {

    let userid = this.userid;

    if (this.fname != null && this.lname != null && this.shortDesc != null && this.aboutTeam != null) {
      this.createLoader();

      // request to server
      this.userService.saveMerchantFormData(userid, this.fname, this.lname, this.shortDesc, this.aboutTeam).subscribe(data => {
        // alert(data.msg);
        this.setDataToStorage(userid, this.fname, this.lname, this.shortDesc, this.aboutTeam);
        this.loader.dismiss();
      }, err => {
        console.log('error: ' + err);
      });
    }
    else {
      this.createAlert();
    }

  }

  // createAlert
  createAlert() {
    const alert = this.alertCtrl.create({
      message: 'Please fill out the required fields.',
      buttons: ['ok']
    });

    alert.present();
  }

  // createLoader
  createLoader() {
    this.loader = this.loadingCtrl.create({
      spinner: 'dots',
      content: 'Please wait...'
    });
    this.loader.present();
  }

  // setDataToStorage
  setDataToStorage(userid: number, fname: string, lname: string, shortDesc: string, aboutTeam: string) {

    let data = {
      userid: userid,
      fname: fname,
      lname: lname,
      shortDesc: shortDesc,
      aboutTeam: aboutTeam
    };

    this.storage.set('merchantForm', data);
  }
} 
