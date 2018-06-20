import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { UserProvider } from '../../providers/user/user';
import { Storage } from '@ionic/storage';
import { UniqueDeviceID } from '@ionic-native/unique-device-id';

/**
 * Generated class for the VolunteerFormPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-volunteer-form',
  templateUrl: 'volunteer-form.html',
})
export class VolunteerFormPage {

  campName: string;
  country: string;
  city: string;
  shortDesc: string;
  aboutCamp: string;

  countries: any;
  loader: any;
  userid: any;
  uuid: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private userService: UserProvider, private storage: Storage, public loadingCtrl: LoadingController, public alertCtrl: AlertController, private uniqueDeviceID: UniqueDeviceID) {
    
    // get countries from storage
    this.storage.get('countries').then((country) => {
        this.countries = country;
    }).catch((err) => {
      console.log('error: '+err);
    });
    
    // get device id
    this.getDeviceID();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VolunteerFormPage');

    
  }

   // getDeviceID
   getDeviceID() {
    this.uniqueDeviceID.get()
      .then((uuid: any) => {
        this.uuid = uuid;  

        // request to userProvide
        this.userService.getUserByDeviceId(this.uuid).subscribe(data => {
          this.userid = data.data.id;
        }, err => {
          console.log(err);
        });
      })
      .catch((error: any) => {
        this.uuid = 'undefined';
      });
  }

  // saveData
  saveData() {

      let userid = this.userid;
    
    if(this.campName != null && this.country != null && this.shortDesc != null && this.aboutCamp != null)
    {
      this.createLoader();
          
      // request to server
      this.userService.saveVolunteerFormData(userid, this.campName, this.country, this.city, this.shortDesc, this.aboutCamp).subscribe(data => {
        alert(data.msg);
        this.loader.dismiss();
      }, err => {
        console.log('error: '+err);
        alert(err);
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
