import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Platform, LoadingController, ModalController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { CharitiesPage } from '../charities/charities';
import { SplashScreen } from '@ionic-native/splash-screen';
import { UserProvider } from '../../providers/user/user';
import { Storage } from '@ionic/storage';
import { GlobalProvider } from '../../providers/global/global';
import { ProfilePage } from '../profile/profile';
import { CardIO, CardIOOptions, CardIOResponse } from '@ionic-native/card-io';


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
  showEmail: boolean;
  mobileno: number = null;
  country: number = null;
  profileStatus: string = null;
  uuid: any = null;
  loader: any;
  preference: any;
  allRegions: any;
  countries: any = [];
  location: any;
  checkCountry: boolean = false;
  checkRegion: boolean = false;

  // variable to store charities
  charities: any = [];
  checkCharity: boolean = false;
  large_donation: boolean = false;
  cause_percentage: number = 90;
  donation_amount: number = 20;
  max: number = 1000;
  sectors: any = [{
    from: 0,
    to: 500,
    color: 'orange'
  }, {
    from: 500,
    to: 1000,
    color: '#30b32d'
  }];

  sectors_1: any = [{
    from: 0,
    to: 45,
    color: 'orange'
  }, {
    from: 45,
    to: 90,
    color: '#30b32d'
  }];

  disablePlusBtn: boolean;
  disableMinusBtn: boolean;
  disableCausePlusBtn: boolean;
  disableCauseMinusBtn: boolean;

  ch_name: string = null;
  card_number: any = null;
  cvv_number: any = null;
  current_year: any = new Date().getFullYear();
  dateObj: Date = new Date();
  card_expiry: any = null;
  all_ngo: any = [];
  ngo_id: string;
  ngo_id_arr: any = [];
  referral_code: any;
  verification_type: any;
  us_tax_deductible: boolean = false;
  recurring_fees: boolean = false;
  accept_terms: boolean = false;

  constructor(private splashScreen: SplashScreen, public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, public platform: Platform, private global: GlobalProvider, private loadingCtrl: LoadingController, private userService: UserProvider, private storage: Storage, private modalCtrl: ModalController, private cardIO: CardIO) {

    // if user try goback then exit app
    this.platform.registerBackButtonAction(() => {
      platform.exitApp();
    });

    // get params from previous opened page
    this.mobileno = this.navParams.get('mobileno');
    this.country = this.navParams.get('country');
    this.firstName = this.navParams.get('fname');
    this.lastName = this.navParams.get('lname');
    this.verification_type = this.navParams.get('verification_type');
    this.email = this.navParams.get('email');

    // check verificaiton type
    if (this.verification_type == 'email') {
      this.showEmail = true;
    }
    else if (this.verification_type == 'both') {
      if (this.navParams.get('email') != '') {
        this.showEmail = true;
      }
      else {
        this.showEmail = false;
      }
    }
    else {
      this.showEmail = false;
    }

    this.large_donation = this.navParams.get('large_donation');
    this.ch_name = this.navParams.get('ch_name');
    this.card_number = this.navParams.get('card_number');
    this.cvv_number = this.navParams.get('cvv_number');

    if (this.navParams.get('cause_percentage')) {
      this.cause_percentage = this.navParams.get('cause_percentage');
      this.donation_amount = this.navParams.get('donation_amount');
    }
    if (this.navParams.get('donation_amount')) {
      this.donation_amount = this.navParams.get('donation_amount');
    }
    if (this.navParams.get('card_expiry')) {
      this.card_expiry = this.navParams.get('card_expiry');
    }


  }

  ionViewDidLoad() {
    // check donation gauge meter
    if (this.donation_amount < 25) {
      this.disableMinusBtn = true;
      this.disablePlusBtn = false;
    }
    if (this.donation_amount >= 950) {
      this.disableMinusBtn = false;
      this.disablePlusBtn = true;
    }

    // check cuase gauge meter
    if(this.cause_percentage <= 1) {
      this.disableCauseMinusBtn = true;
      this.disableCausePlusBtn = false;
    }
    if(this.cause_percentage >= 85) {
      this.disableCausePlusBtn = true;
      this.disableCauseMinusBtn = false;
    }
    console.log('ionViewDidLoad UserinfoPage');

    // check if have uuid
    if (this.global.uuid()) {
      this.uuid = this.global.uuid();
    }
    else {
      this.uuid = 'undefined';
    }

    // add date default date in expiry
    let year = this.dateObj.getFullYear() + 1;
    let month = this.dateObj.getMonth() + 1;
    this.card_expiry = year + '-' + month;

    // load countries and regions
    this.loadCountries();
    this.loadRegions();

  }

  // incrementDonation
  incrementDonation() {
    if(this.donation_amount < 25) {
      this.donation_amount = this.donation_amount + 5;
    }
    else if (this.donation_amount < 500 && this.donation_amount >= 25) {
      this.donation_amount = this.donation_amount + 25;
    }
    else if (this.donation_amount >= 500 && this.donation_amount <= 950) {
      this.donation_amount = this.donation_amount + 50;
    }

    if (this.donation_amount >= 25 && this.donation_amount < 950) {
      this.disableMinusBtn = false;
      this.disablePlusBtn = false;
    }
    else if (this.donation_amount > 950) {
      this.disablePlusBtn = true;
      this.disableMinusBtn = false;
    }
  }

  // decrementDonation
  decrementDonation() {
    if(this.donation_amount <= 25) {
      this.donation_amount = this.donation_amount - 5;
    }
    else if (this.donation_amount <= 500 && this.donation_amount > 25) {
      this.donation_amount = this.donation_amount - 25;
    }
    else if (this.donation_amount > 500 && this.donation_amount <= 1000) {
      this.donation_amount = this.donation_amount - 50;
    }

    if (this.donation_amount >= 25 && this.donation_amount < 1000) {
      this.disableMinusBtn = false;
      this.disablePlusBtn = false;
    }
    else if (this.donation_amount < 25) {
      this.disablePlusBtn = false;
      this.disableMinusBtn = true;
    }
  }

  // incrementCause
  incrementCause() {  
    this.cause_percentage = this.cause_percentage + 5;

    if(this.cause_percentage > 85) {
      this.disableCausePlusBtn = true;
      this.disableCauseMinusBtn = false;
    }
    else if(this.cause_percentage < 90 && this.cause_percentage > 1) {
      this.disableCausePlusBtn = false;
      this.disableCauseMinusBtn = false;
    }
  }

  // decrementCause
  decrementCause() {    
    this.cause_percentage = this.cause_percentage - 5;

    if(this.cause_percentage < 90 && this.cause_percentage > 1) {
      this.disableCausePlusBtn = false;
      this.disableCauseMinusBtn = false;
    }
    else if(this.cause_percentage <= 1) {
      this.disableCausePlusBtn = false;
      this.disableCauseMinusBtn = true;
    }
  }

  // checkPreference
  checkPreference(preference: string) {
    if (preference == 'country' && this.checkCountry == false) {
      this.checkCountry = false;
      this.ngo_id_arr = [];
    }
    else if (preference == 'country' && this.checkCountry == true) {
      this.checkCountry = true;
      this.checkRegion = false;
      this.preference = preference;
      this.ngo_id_arr = [];
    }

    if (preference == 'region' && this.checkRegion == false) {
      this.checkRegion = false;
      this.ngo_id_arr = [];
    }
    else if (preference == 'region' && this.checkRegion == true) {
      this.checkRegion = true;
      this.checkCountry = false;
      this.preference = preference;
      this.ngo_id_arr = [];
    }
  }

  // getSelectedNgo
  getSelectedNgo(checked: any, id: any) {
    if (checked == true) {
      this.ngo_id_arr.push(id);
    }
    else {
      this.ngo_id_arr.pop(id);
    }
  }

  // setCardHolderName
  setCardHolderName() {
    // check if first name and last name not null then insert fullname in ch_name
    if (this.firstName != null && this.lastName != null) {
      this.ch_name = this.firstName + ' ' + this.lastName;
    }
  }

  // scanCard
  scanCard() {
    this.cardIO.canScan()
      .then(
        (res: boolean) => {
          if (res) {
            let options: CardIOOptions = {
              requireCardholderName: true,
              requireCVV: true,
              scanExpiry: true,
              requireExpiry: true,
              scanInstructions: "Scan your card to continue."
            };
            this.cardIO.scan(options).then((cardResponse: CardIOResponse) => {
              this.ch_name = cardResponse.cardholderName;
              this.card_number = cardResponse.cardNumber,
                this.cvv_number = cardResponse.cvv;

              // check if month is less than 10 then add 0
              if (cardResponse.expiryMonth < 10) {
                this.card_expiry = cardResponse.expiryYear + '-0' + cardResponse.expiryMonth;
              }
              else {
                this.card_expiry = cardResponse.expiryYear + '-' + cardResponse.expiryMonth;
              }
            });
          }
        }
      );
  }

  // registerUser
  registerUser() {

    // check if all fields are not empty then register user
    if (this.firstName == null || this.lastName == null || this.email == null || this.ch_name == null || this.card_number == null || this.cvv_number == null || this.card_expiry == null || this.charities.length == 0 || this.accept_terms == false || this.recurring_fees == false) {
      this.createAlert('We need a little more information about you. Please fill out all fields marked with (*) before continuing. <p>Thanks.</p>');
    }
    else {

      if (this.validateEmail(this.email) == true) {
        // check if mobileno and coutnry not empty then 
        if (this.mobileno !== null && this.country !== null) {
          // make server request
          this.makeServerRequest();
        }
      }
      else {
        this.createAlert("please enter valid email");
      }
    }
  }

  // makeServerRequest
  makeServerRequest() {
    this.createLoader('submitting your request');

    // declare empty array for charity
    let charities = [];

    // loop of selected charity
    this.charities.forEach(element => {

      // remove starting space from each element and push into charity array
      charities.push(element.trim());
    });

    // check if none selected ngo then assign automaticaly ngo to member
    if (this.ngo_id_arr.length < 1) {
      let i = 1;
      this.all_ngo.forEach(element => {
        if (i <= 5) {
          this.ngo_id_arr.push(element.id);
        }
        i++;
      });
    }

    // conver array to stirng
    this.ngo_id = this.ngo_id_arr.toString();

    // calculate hc amount
    let hc_amount = this.donation_amount * 100;
    let ngo_count = parseInt(this.ngo_id_arr.length);
    let cause_percentage = this.cause_percentage;
    let calculated_amount = hc_amount / 100 * cause_percentage;
    let hc_balance = hc_amount - calculated_amount;
    let us_balance = hc_balance / 100;
    let hc_amount_per_ngo = calculated_amount / ngo_count;
    let us_amount_per_ngo = hc_amount_per_ngo / 100;

    let referral_code = '';
    let referral_amount = '';

    // check if user have referral code
    if ((this.referral_code)) {
      referral_code = this.referral_code;
      referral_amount = '5';
    }

    let accept_terms = '';
    let recurring_fees = '';

    if (this.accept_terms == true) {
      accept_terms = 'true';
    }
    else {
      accept_terms = 'false';
    }

    if (this.recurring_fees == true) {
      recurring_fees = 'true';
    }
    else {
      recurring_fees = 'false';
    }


    const data = {
      profile_status: 'verified',
      fname: this.firstName,
      lname: this.lastName,
      email: this.email,
      cause_percentage: this.cause_percentage,
      donation_amount: this.donation_amount,
      hc_balance: hc_balance,
      us_balance: us_balance,
      hc_amount: hc_amount,
      us_amount_per_ngo: us_amount_per_ngo,
      hc_amount_per_ngo: hc_amount_per_ngo,
      ngo_id: this.ngo_id,
      ch_name: this.ch_name,
      card_number: this.card_number,
      cvv_number: this.cvv_number,
      card_expiry: this.card_expiry,
      large_donation: this.large_donation,
      charity_type: charities.toString(),
      preference_type: this.preference,
      preference_location: this.location,
      mobileno: this.mobileno,
      country: this.country,
      referral_code: referral_code,
      referral_amount: referral_amount,
      verification_type: this.verification_type,
      accept_terms: accept_terms,
      recurring_fees: recurring_fees
    };

    this.userService.verifyUserProfile(data).subscribe(data => {
      this.profileStatus = data.data.profile_status;

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

        // save user data in storage
        this.storage.set('user_data', data.data);

        // gotodashboard
        this.navCtrl.setRoot(HomePage);
      }

      // check if msg failed
      if (data.msg == 'failed') {
        this.createAlert('Server is unable to submit your request. Please try again later.');
      }

      this.loader.dismiss();
    }, err => {
      console.log(err);
      this.loader.dismiss();
    });
  }

  // gotoCharityPage
  gotoCharityPage() {
    this.ngo_id_arr = [];

    // declare empty array for charity
    let charities = [];

    // loop of selected charity
    this.charities.forEach(element => {

      // remove starting or end space from each element and push into charity array
      charities.push(element.trim());
    });

    // goto charity page
    const modal = this.modalCtrl.create(CharitiesPage, {
      charities: charities,
      page: 'userinfo'
    });
    modal.present();

    modal.onDidDismiss((data) => {
      this.ngo_id_arr = [];
      console.log('view dismiss run successfuly');

      // declare empty array for charity
      let charities = [];

      // loop of charity
      data.charities.forEach(element => {
        if (element.value == true) {
          // push element to charity arr
          charities.push(element.name.trim());
        }
      });

      this.checkCharity = true;

      // store selected charities in charities variable
      this.charities = charities;

      // get ngo of charities
      if (this.charities.length > 0) {
        let selected_charity = [];
        this.charities.forEach(element => {
          selected_charity.push(element.trim());
        });
        this.getNgoByCharity(selected_charity);
      }
    });
  }

  // getPreferenceCheck
  getPreferenceCheck(country: boolean, region: boolean) {
    // check if country and region false
    if (country == false && region == false) {
      this.filterAllNgo();
    }
  }

  // filterAllNgo
  filterAllNgo() {
    this.ngo_id_arr = [];

    // check if length of ngo is greater then 0
    if (this.all_ngo.length > 0 || this.charities.length > 0) {
      // emtpy all ngo array
      this.all_ngo = [];

      // get ngo of charities
      if (this.charities.length > 0) {
        let selected_charity = [];
        this.charities.forEach(element => {
          selected_charity.push(element.trim());
        });
        this.getNgoByCharity(selected_charity);
      }
    }
  }

  // createLoader
  createLoader(msg: string = 'Please wait...') {
    this.loader = this.loadingCtrl.create({
      spinner: 'dots',
      content: msg
    });

    this.loader.present();
  }

  // createAlert
  createAlert(msg: string) {
    const alert = this.alertCtrl.create({
      message: msg,
      buttons: ['ok']
    });
    alert.present();
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

  // loadCountries
  loadCountries() {
    // get countries from storage
    this.userService.getAllCountries().subscribe(country => {
      this.countries = country;
    }, err => {
      console.log('err: ' + err);
    });
  }

  // loadRegions
  loadRegions() {
    // request region from server
    this.userService.getAllRegions().subscribe(data => {
      this.allRegions = data;
    }, err => {
      console.log('err: ' + err);
    });
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

      // emtpy all ngo array
      this.all_ngo = [];

      // getNgoByCharityIds
      this.userService.getNgoByCharityIds(charity_ids).subscribe(res => {

        let us_tax_deductible;
        if (this.us_tax_deductible == true) {
          us_tax_deductible = 'true';
        }
        else {
          us_tax_deductible = 'false';
        }

        // check if tax exemption == true
        if (us_tax_deductible == 'true') {
          // loop of res
          res.forEach(element => {
            // check if country is true
            if (this.checkCountry == true) {
              // check if elment matched to tax exemption
              if (element.us_tax_deductible == us_tax_deductible && element.country == this.location) {
                this.all_ngo.push(element);
              }
            }
            else if (this.checkRegion == true) {
              if (element.us_tax_deductible == us_tax_deductible && element.region == this.location) {
                this.all_ngo.push(element);
              }
            }
            else if (this.checkRegion == false && this.checkCountry == false) {
              // check if elment matched to tax exemption
              if (element.us_tax_deductible == us_tax_deductible) {
                this.all_ngo.push(element);
              }
            }
          });
          // console.log('tax exemption if condition');
        }
        else {
          // loop of res
          res.forEach(element => {
            // check if country is true
            if (this.checkCountry == true) {
              // check if elment matched to tax exemption
              if (element.country == this.location) {
                this.all_ngo.push(element);
              }
            }
            else if (this.checkRegion == true) {
              if (element.region == this.location) {
                this.all_ngo.push(element);
              }
            }
            else if (this.checkRegion == false && this.checkCountry == false) {
              this.all_ngo.push(element);
            }
          });
          // console.log('tax exemption else condition');        
        }


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

  // viewNgoProfile
  viewNgoProfile(ngoid: any) {
    this.navCtrl.push(ProfilePage, {
      id: ngoid,
      page: 'register',
      uuid: this.uuid
    });
  }
}
