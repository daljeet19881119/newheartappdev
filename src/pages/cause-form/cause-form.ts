import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { UserProvider } from '../../providers/user/user';

/**
 * Generated class for the CauseFormPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-cause-form',
  templateUrl: 'cause-form.html',
})
export class CauseFormPage {

  countries: any;
  fname: string;
  lname: string;
  causeCat: string;
  country: string;
  city: string;
  shortDesc: string;
  aboutYourself: string;
  aboutCause: string;

  contactName1: string;
  contactEmail1: string;
  contactDesc1: string;

  contactName2: string;
  contactEmail2: string;
  contactDesc2: string;

  contactName3: string;
  contactEmail3: string;
  contactDesc3: string;

  contactName4: string;
  contactEmail4: string;
  contactDesc4: string;

  contactName5: string;
  contactEmail5: string;
  contactDesc5: string;

  loader: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage, private userService: UserProvider, public loadingCtrl: LoadingController, public alertCtrl: AlertController) {

    // store all countries
    this.storage.get('countries').then((val) => {
        this.countries = val;
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CauseFormPage');
  }

  // saveData
  saveData() {


    let contact1 = this.contactName1+','+this.contactEmail1+','+this.contactDesc1;
    let contact2 = this.contactName2+','+this.contactEmail2+','+this.contactDesc2;
    let contact3 = this.contactName3+','+this.contactEmail3+','+this.contactDesc3;
    let contact4 = this.contactName4+','+this.contactEmail4+','+this.contactDesc4;
    let contact5 = this.contactName5+','+this.contactEmail5+','+this.contactDesc5;
    let userid = 1;

    if(this.fname != null && this.lname != null && this.causeCat != null && this.country != null && this.city != null && this.shortDesc != null && this.aboutYourself != null && this.aboutCause != null)
    {
            
        // call func createLoader
        this.createLoader();

        // request user provider
        this.userService.saveCauseFormData(userid, this.fname, this.lname, this.causeCat, this.country, this.city, this.shortDesc, this.aboutYourself, this.aboutCause, contact1, contact2, contact3, contact4, contact5).subscribe(data => {
          
          if(data.msg == 'success')
          {
            this.loader.dismiss();
          }
          if(data.msg == 'err')
          {
            this.loader.dismiss();
          }
        }, err => {
          console.log('error: '+err);
        });
    }
    else{
      this.createAlert();
    }
  }

  // createLoader
  createLoader() {
    this.loader = this.loadingCtrl.create({
      spinner: 'dots',
      content: 'Please wait...'
    });

    this.loader.present();
  }

  // createAlert
  createAlert() {
    const alert = this.alertCtrl.create({
          message: 'Please fill all fields.',
          buttons: ['ok']
    });

    alert.present();
  }
}
