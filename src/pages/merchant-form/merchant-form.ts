import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { UserProvider } from '../../providers/user/user';
import { Storage } from '@ionic/storage';
import { HomePage } from '../home/home';
import { GlobalProvider } from '../../providers/global/global';


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

  userid: any;
  uuid: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private userService: UserProvider, private global: GlobalProvider, private storage: Storage, private platform: Platform) {

    // get data from storage
    this.storage.get('merchantForm').then((val) => {
      this.fname = val.fname;
      this.lname = val.lname;
      this.shortDesc = val.shortDesc;
      this.aboutTeam = val.aboutTeam;
    }).catch((err) => {
      console.log(err);
    });

    // if user try goback then go to homepage
    this.platform.registerBackButtonAction(() => {
      this.navCtrl.push(HomePage);
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MerchantFormPage');
    if (this.global.uuid()) {
      this.uuid = this.global.uuid();
    }
    else {
      this.uuid = 'undefined';
    }

    // request to userProvide
    this.userService.getUserByDeviceId(this.uuid).subscribe(data => {
      this.userid = data.data.id;
    }, err => {
      console.log(err);
    });
  }

  // saveData
  saveData() {

    let userid = this.userid;

    if (this.fname != null && this.lname != null && this.shortDesc != null && this.aboutTeam != null) {
      this.global.createLoader('Please wait...');

      const data = {
        user_id: userid,
        fname: this.fname,
        lname: this.lname,
        short_desc: this.shortDesc,
        about_team: this.aboutTeam
      };

      // request to server
      this.userService.saveMerchantFormData(data).subscribe(data => {
        // alert(data.msg);
        this.setDataToStorage(userid, this.fname, this.lname, this.shortDesc, this.aboutTeam);
        this.global.dismissLoader();
      }, err => {
        console.log(err);
        this.global.dismissLoader();
      });
    }
    else {
      this.global.createAlert('', 'Please fill out the required fields.');
    }

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
