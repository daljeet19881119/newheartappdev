import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ModalController, Platform } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { HomePage } from '../home/home';
import { UniqueDeviceID } from '@ionic-native/unique-device-id';
import { CharitiesPage } from '../charities/charities';

/**
 * Generated class for the UserinfoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-userinfo',
  templateUrl: 'userinfo.html',
})
export class UserinfoPage {

  charityType: string = 'human rights';
  gender: string = 'male';
  firstName: string = null;
  lastName: string = null;
  email: string = null;
  mobileno: number = null;
  country: number = null;
  profileStatus: string = null;
  uuid: any = null;

  // variable to store charities
  charities: any = [];
  checkCharity: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, private http: Http, private modalCtrl: ModalController, public platform: Platform, private uniqueDeviceID: UniqueDeviceID) {

    // if user try goback then exit app
    this.platform.registerBackButtonAction(() => {
      platform.exitApp();
    });

    // call getDeviceID
    this.getDeviceID();

    // get params from previous opened page
    this.mobileno = this.navParams.get('mobileno');
    this.country = this.navParams.get('country');
    this.firstName = this.navParams.get('fname');
    this.lastName = this.navParams.get('lname');
    this.email = this.navParams.get('email');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserinfoPage');

    // check if charities comes
    if(this.navParams.get('charities'))
    { 
      // store charities object that are send from the charities page
      let charities = this.navParams.get('charities');

      // loop all charities
      charities.forEach(element => {

        // sotore only selected charities in array
        if(element.value == true)
        {
          this.charities.push(element.name);
        }
      });
      this.checkCharity = true;
    }
  }

  // registerUser
  registerUser() {

    // check if all fields are not empty then register user
    if(this.firstName ===null || this.lastName ===null || this.email ===null)
    {
        const alert = this.alertCtrl.create({
          message: 'We need a little more information about you. Please fill out all fields before continuing. <p>Thanks.</p>',
          buttons: ['ok']
        });
        alert.present();
    }
    else{

      // check if mobileno and coutnry not empty then 
      if(this.mobileno !== null && this.country !== null)
      {
        // make server request
         this.makeServerRequest();
      }      
    }
  }

  // getDeviceID
  getDeviceID() {
    this.uniqueDeviceID.get()
      .then((uuid: any) => {
        this.uuid = uuid;  
        
        // call requestData
        this.requestData();
      })
      .catch((error: any) => {
        console.log(error);
      });
  }

  // makeServerRequest
  makeServerRequest() {
    this.http.get('http://ionic.dsl.house/heartAppApi/verify-users.php?profile_status=verified&fname='+this.firstName+'&lname='+this.lastName+'&email='+this.email+'&gender='+this.gender+'&charity_type='+this.charities+'&c_code='+this.country+'&m_no='+this.mobileno).map(res => res.json()).subscribe(data => {
      this.profileStatus = data.data.profile_status;
      console.log(data);

      // check if profileStatus is null
      if(this.profileStatus !== null && this.profileStatus =='verified')
      {
        // gotodashboard
        const modal = this.modalCtrl.create(HomePage);
        modal.present();
      }

    }, error => {
      console.log('Oops!');
    });
  }

  // requestData
  requestData() {

    this.http.get('http://ionic.dsl.house/heartAppApi/get-verified-user.php?uuid='+this.uuid).map(res => res.json()).subscribe(data => {
      this.mobileno = data.data.mobileno;
      this.country = data.data.country;
      
    }, error => {
      console.log(error);
    });
  }

  // gotoCharityPage
  gotoCharityPage() {
    console.log('selected charities: '+this.charities);
    this.navCtrl.push(CharitiesPage, {charities: this.charities, mobileno: this.mobileno, c_code: this.country, fname: this.firstName, lname: this.lastName, email: this.email});
  }
}
