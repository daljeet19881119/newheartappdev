import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { UserProvider } from '../../providers/user/user';

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

  constructor(public navCtrl: NavController, public navParams: NavParams, private userService: UserProvider, public alertCtrl: AlertController, public loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MerchantFormPage');

  }

  // saveData
  saveData() {

    let userid = 1;

    if(this.fname != null && this.lname != null && this.shortDesc != null && this.aboutTeam != null)
    {
        this.createLoader();

        // request to server
        this.userService.saveMerchantFormData(userid, this.fname, this.lname, this.shortDesc, this.aboutTeam).subscribe(data => {
          alert(data.msg);
          this.loader.dismiss();
      }, err => {
        console.log('error: '+err);
      });
    }
    else{
      this.createAlert();
    }
    
  }

  // createAlert
  createAlert() {
    const alert = this.alertCtrl.create({
          message: 'Please fill all fields.',
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
} 
