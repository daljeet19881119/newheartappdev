import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ModalController, Platform, LoadingController } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { HomePage } from '../home/home';
import { UniqueDeviceID } from '@ionic-native/unique-device-id';
import { CharitiesPage } from '../charities/charities';
import { SplashScreen } from '@ionic-native/splash-screen';

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
  loader: any;

  // variable to store charities
  charities: any = [];
  checkCharity: boolean = false;

  constructor(private splashScreen: SplashScreen, public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, private http: Http, private modalCtrl: ModalController, public platform: Platform, private uniqueDeviceID: UniqueDeviceID, private loadingCtrl: LoadingController) {

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
          this.charities.push('  '+element.name);
        }
      });
      this.checkCharity = true;
    }
  }

  // registerUser
  registerUser() {

    // check if all fields are not empty then register user
    if(this.firstName ===null || this.lastName ===null || this.email ===null || this.charities.length === 0)
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

    // declare empty array for charity
    let charities = [];

    // loop of selected charity
    this.charities.forEach(element => {

      // remove starting space from each element and push into charity array
      charities.push(element.replace('  ',''));
    }); 

    this.http.get('http://ionic.dsl.house/heartAppApi/verify-users.php?profile_status=verified&fname='+this.firstName+'&lname='+this.lastName+'&email='+this.email+'&charity_type='+charities+'&c_code='+this.country+'&m_no='+this.mobileno).map(res => res.json()).subscribe(data => {
      this.profileStatus = data.data.profile_status;
      console.log(data);

      // check if profileStatus is null
      if(this.profileStatus !== null && this.profileStatus =='verified')
      {
        
        this.reload();

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

    // declare empty array for charity
    let charities = [];

    // loop of selected charity
    this.charities.forEach(element => {

      // remove starting space from each element and push into charity array
      charities.push(element.replace('  ',''));
    }); 

    // create modal
     const modal = this.modalCtrl.create(CharitiesPage, {
                          charities: charities, 
                          page: 'userinfo',
                          mobileno: this.mobileno, 
                          c_code: this.country, 
                          fname: this.firstName, 
                          lname: this.lastName, 
                          email: this.email
                  });
                  modal.present();
  }

  // createLoader
  createLoader() {
    this.loader = this.loadingCtrl.create({
      spinner: 'dots',
      content: 'Please wait...'
    });

    this.loader.present();
  }

  
  // reload
  reload(){
    this.splashScreen.show();
    window.location.reload();
  }
}
