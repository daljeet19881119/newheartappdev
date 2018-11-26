import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Platform, LoadingController } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { HomePage } from '../home/home';
import { CharitiesPage } from '../charities/charities';
import { SplashScreen } from '@ionic-native/splash-screen';
import { UserProvider } from '../../providers/user/user';
import { Storage } from '@ionic/storage';
import { GlobalProvider } from '../../providers/global/global';

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
  preference: any;
  allRegions: any;
  countries: any;
  location: any;

  // variable to store charities
  charities: any = [];
  checkCharity: boolean = false;
  large_donation: boolean = false;
  cause_percentage: any = 90;
  donation_amount: any = 20;

  ch_name: string = null;
  card_number: any = null;
  cvv_number: any = null;
  card_expiry: any = null;
  current_year: any = new Date().getFullYear();
  all_ngo: any;
  ngo_id: string;
  ngo_id_arr: any = [];
  constructor(private splashScreen: SplashScreen, public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, private http: Http, public platform: Platform, private global: GlobalProvider, private loadingCtrl: LoadingController, private userService: UserProvider, private storage: Storage) {

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
    this.large_donation = this.navParams.get('large_donation');
    this.ch_name = this.navParams.get('ch_name');
    this.card_number = this.navParams.get('card_number');
    this.cvv_number = this.navParams.get('cvv_number');

    if(this.navParams.get('cause_percentage')){
      this.cause_percentage = this.navParams.get('cause_percentage');
      this.donation_amount = this.navParams.get('donation_amount');
    }
    if(this.navParams.get('donation_amount')){
      this.donation_amount = this.navParams.get('donation_amount');
    }
    if(this.navParams.get('card_expiry')){
      this.card_expiry = this.navParams.get('card_expiry');
    }
    

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserinfoPage');

    // check if charities comes
    if (this.navParams.get('charities')) {
      // store charities object that are send from the charities page
      let charities = this.navParams.get('charities');

      // loop all charities
      charities.forEach(element => {

        // sotore only selected charities in array
        if (element.value == true) {
          this.charities.push('  ' + element.name);
        }
      });
      this.checkCharity = true;
    }
  }

  ionViewDidEnter() {
    console.log('ion view did enter');
    if (this.charities.length > 0) {
      let selected_charity = [];
      this.charities.forEach(element => {
        selected_charity.push(element.trim());
      });
      this.getNgoByCharity(selected_charity);
    }
  }

  getSelectedNgo(checked: any, id: any) {
    if(checked == true) {
      this.ngo_id_arr.push(id);
    }
    else{
      this.ngo_id_arr.pop(id);
    }
  }
  // registerUser
  registerUser() {

    // check if all fields are not empty then register user
    if (this.firstName == null || this.lastName == null || this.email == null || this.ch_name == null || this.card_number == null || this.cvv_number == null || this.card_expiry == null || this.charities.length == 0) {
      const alert = this.alertCtrl.create({
        message: 'We need a little more information about you. Please fill out all fields marked with (*) before continuing. <p>Thanks.</p>',
        buttons: ['ok']
      });
      alert.present();
    }
    else{

      if (this.validateEmail(this.email) == true) {

        // check if mobileno and coutnry not empty then 
        if (this.mobileno !== null && this.country !== null) {
          // make server request
          this.makeServerRequest();
        }
      }
      else{
        alert("please enter valid email");
      }
    }
  }

  // getDeviceID
  getDeviceID() {
    if(this.global.uuid()) {
      this.uuid = this.global.uuid();

      // call requestData
      this.requestData();
    }
  }

  // makeServerRequest
  makeServerRequest() {

    // declare empty array for charity
    let charities = [];

    // loop of selected charity
    this.charities.forEach(element => {

      // remove starting space from each element and push into charity array
      charities.push(element.replace('  ', ''));
    });
    
    // conver array to stirng
    this.ngo_id = this.ngo_id_arr.toString();

    // calculate hc amount
    let hc_amount = this.donation_amount * 100;
    let ngo_count = parseInt(this.ngo_id_arr.length);
    let us_amount_per_ngo = this.donation_amount / ngo_count;
    let hc_amount_per_ngo = hc_amount / ngo_count;

    this.http.get(this.global.SITE_URL + '/verify-users.php?profile_status=verified&fname=' + this.firstName + '&lname=' + this.lastName + '&email=' + this.email + '&cause_percentage='+ this.cause_percentage +'&donation_amount='+ this.donation_amount +'&hc_amount='+ hc_amount +'&us_amount_per_ngo='+ us_amount_per_ngo +'&hc_amount_per_ngo='+ hc_amount_per_ngo +'&ngo_id='+ this.ngo_id +'&ch_name='+ this.ch_name +'&card_number='+ this.card_number +'&cvv_number='+ this.cvv_number +'&card_expiry='+ this.card_expiry +'&large_donation='+ this.large_donation +'&charity_type=' + charities + '&preference_type=' + this.preference + '&location=' + this.location + '&c_code=' + this.country + '&m_no=' + this.mobileno).map(res => res.json()).subscribe(data => {
      this.profileStatus = data.data.profile_status;
      console.log(data);

      // check if profileStatus is null
      if (this.profileStatus !== null && this.profileStatus == 'verified') {
        // reload the app
        // this.reload();

        // store user charities in storage
        let charities = data.data.charity_type;
         
        // convert charities string to array
        charities = charities.split(',');

        // save all user charity or causes in storage
        this.storage.set('user_causes', charities);

        // gotodashboard
        this.navCtrl.setRoot(HomePage);
      }

    }, err => {
      console.log('Oops!');
    });
  }

  // requestData
  requestData() {

    this.http.get(this.global.SITE_URL + '/get-verified-user.php?uuid=' + this.uuid).map(res => res.json()).subscribe(data => {
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
      charities.push(element.replace('  ', ''));
    });

    this.navCtrl.push(CharitiesPage, {
      charities: charities,
      page: 'userinfo',
      mobileno: this.mobileno,
      c_code: this.country,
      fname: this.firstName,
      lname: this.lastName,
      email: this.email,
      cause_percentage: this.cause_percentage,
      donation_amount: this.donation_amount,
      large_donation: this.large_donation,
      ch_name: this.ch_name,
      card_number: this.card_number,
      cvv_number: this.cvv_number,
      card_expiry: this.card_expiry
    });
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
  reload() {
    this.splashScreen.show();
    window.location.reload();
  }

  // validateEmail
  validateEmail(mail: string) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
      return true;
    }
    else {
      return false;
    }
  }

  // getPreference
  getPreference() {

    // if user select region then get all region
    if (this.preference == 'region') {
      this.createLoader();

      // request region from server
      this.userService.getAllRegions().subscribe(data => {
        this.allRegions = data;
        this.loader.dismiss();
      }, err => {
        console.log('err: ' + err);
        this.loader.dismiss();
      });
    }

    // if user select country then get all countries
    if (this.preference == 'country') {
      this.createLoader();

      // get countries from storage
      this.storage.get('countries').then((country) => {
        this.countries = country;
        this.loader.dismiss();
      }).catch((err) => {
        console.log('error: ' + err);
        this.loader.dismiss();
      });
    }
  }

  // get ngo by charity name
  getNgoByCharity(selected_charity: any) {
    this.createLoader();
    this.userService.getAllCharities().subscribe(data => {
      let charity_ids = [];
      data.forEach(element => {
        // check charity name in array then store that id
        if (selected_charity.indexOf(element.name) != -1) {
          charity_ids.push(element.id);
        }
      });

      // getNgoByCharityIds
      this.userService.getNgoByCharityIds(charity_ids).subscribe(res => {
        this.all_ngo = res;
        this.loader.dismiss();
      }, err => {
        console.log(err);
        this.loader.dismiss();
      });
    }, err => {
      console.log(err);
      this.loader.dismiss();
    });
  }

  // toLocaleString
  toLocaleString(number: any) {
    return number.toLocaleString();
  }
}
