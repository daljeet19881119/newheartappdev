import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ModalController, Platform, ToastController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { CharitiesPage } from '../charities/charities';
import { SplashScreen } from '@ionic-native/splash-screen';
import { UserProvider } from '../../providers/user/user';
import { GlobalProvider } from '../../providers/global/global';
import { ProfilePage } from '../profile/profile';
import { CardIO, CardIOOptions, CardIOResponse } from '@ionic-native/card-io';
import { InAppBrowser } from '@ionic-native/in-app-browser';


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
  preference: any;
  allRegions: any;
  countries: any = [];
  location: any;
  checkCountry: boolean = false;
  checkRegion: boolean = false;

  // variable to store charities
  all_charities: any = [];
  charities: any = [];
  selected_charity: any = [];
  checkCharity: boolean = false;
  large_donation: boolean = false;
  cause_percentage: number = 90;
  donation_amount: number = 25;
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
  card_btn: boolean = false;
  current_year: any = new Date().getFullYear();
  dateObj: Date = new Date();
  card_expiry: any = null;
  all_bh: any = [];
  bh_id: string;
  bh_id_arr: any = [];
  referral_code: any;
  verification_type: any;
  us_tax_deductible: boolean = false;
  recurring_fees: boolean = false;
  accept_terms: boolean = false;
  user_id: any;
  constructor(private splashScreen: SplashScreen, public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController,  private global: GlobalProvider, private userService: UserProvider, private modalCtrl: ModalController, private cardIO: CardIO, private iab: InAppBrowser, private platform: Platform, private toastCtrl: ToastController) {


    // get params from previous opened page
    this.mobileno = this.navParams.get('mobileno');
    this.country = this.navParams.get('country');
    this.firstName = this.navParams.get('fname');
    this.lastName = this.navParams.get('lname');
    this.verification_type = this.navParams.get('verification_type');
    this.email = this.navParams.get('email');
    this.user_id = this.navParams.get('user_id');

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
    if (this.donation_amount <= 25) {
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
    // if(this.donation_amount < 25) {
    //   this.donation_amount = this.donation_amount + 5;
    // }
    if (this.donation_amount < 500 && this.donation_amount >= 25) {
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
    // if(this.donation_amount <= 25) {
    //   this.donation_amount = this.donation_amount - 5;
    // }
    if (this.donation_amount <= 500 && this.donation_amount > 25) {
      this.donation_amount = this.donation_amount - 25;
    }
    else if (this.donation_amount > 500 && this.donation_amount <= 1000) {
      this.donation_amount = this.donation_amount - 50;
    }

    if (this.donation_amount > 25 && this.donation_amount < 1000) {
      this.disableMinusBtn = false;
      this.disablePlusBtn = false;
    }
    else if (this.donation_amount <= 25) {
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
      this.bh_id_arr = [];
    }
    else if (preference == 'country' && this.checkCountry == true) {
      this.checkCountry = true;
      this.checkRegion = false;
      this.preference = preference;
      this.bh_id_arr = [];
    }

    if (preference == 'region' && this.checkRegion == false) {
      this.checkRegion = false;
      this.bh_id_arr = [];
    }
    else if (preference == 'region' && this.checkRegion == true) {
      this.checkRegion = true;
      this.checkCountry = false;
      this.preference = preference;
      this.bh_id_arr = [];
    }

    if(this.checkRegion == false && this.checkCountry == false) {
      this.preference = '';
      this.bh_id_arr = [];
    }
  }

  // getSelectedNgo
  getSelectedNgo(checked: any, id: any) {
    if (checked == true) {
      this.bh_id_arr.push(id);
    }
    else {
      this.bh_id_arr.pop(id);
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
    if (this.firstName == null || this.lastName == null || this.email == null || this.charities.length == 0 || this.accept_terms == false || this.recurring_fees == false) {
      this.global.createAlert('', 'We need a little more information about you. Please fill out all fields marked with (*) before continuing. <p>Thanks.</p>');
    }
    else {

      if (this.validateEmail(this.email) == true) {
        // check if card registered
        if(this.card_btn == false || this.card_number == null || this.card_number == "") {
          if(this.platform.is('ios')) {
            this.global.createAlert('', 'Your card is not registered. Please click on add card button to register your card.');
          }
          else{
            this.global.createAlert('', "Your card is not registered. Please register your card.");
          }
        }
        else if(this.bh_id_arr.length < 1 && this.all_bh.length < 1) {
          this.global.createAlert('', "There is no Bigheart in selected causes. Please select other causes to donate to Bighearts.");
        }
        else{
          // check if mobileno and coutnry not empty then 
          if (this.mobileno !== null && this.country !== null) {
            // paymentAlert
            this.paymentAlert();
          }
        }        
      }
      else {
        this.global.createAlert('', "please enter valid email");
      }
    }
  }

  // makeServerRequest
  makeServerRequest() {   

    // declare empty array for charity
    let charities = [];

    // loop of selected charity
    this.charities.forEach(element => {

      // remove starting space from each element and push into charity array
      charities.push(element.trim());
    });

    // check if none selected ngo then assign automaticaly ngo to member
    if (this.bh_id_arr.length < 1) {
      let i = 1;
      this.all_bh.forEach(element => {
        if (i <= 5) {
          this.bh_id_arr.push(element.user_id);
        }
        i++;
      });
    }

    // conver array to stirng
    this.bh_id = this.bh_id_arr.toString();

    // calculate hc amount
    let hc_amount = this.donation_amount * 100;
    let ngo_count = parseInt(this.bh_id_arr.length);
    let cause_percentage = this.cause_percentage;
    let calculated_amount = hc_amount / 100 * cause_percentage;    
    let hc_amount_per_ngo = calculated_amount / ngo_count;
    let us_amount_per_ngo = hc_amount_per_ngo / 100;

    // calculate hg user fees 10%
    let hg_hc_amount = hc_amount / 100 * 10;
    let hg_us_amount = hg_hc_amount / 100;

    let hc_balance = hc_amount - calculated_amount - hg_hc_amount;
    let us_balance = hc_balance / 100;

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

    // let us_donation_amount = this.donation_amount / 100 * 5 + this.donation_amount;
    let us_donation_amount = this.donation_amount;
    let hc_donation_amount = us_donation_amount * 100;

    const data = {
      profile_status: 'verified',
      fname: this.firstName,
      lname: this.lastName,
      email: this.email,
      cause_percentage: this.cause_percentage,
      us_donation_amount: us_donation_amount,
      hc_donation_amount: hc_donation_amount,
      hc_balance: hc_balance,
      us_balance: us_balance,
      us_amount_per_ngo: us_amount_per_ngo,
      hc_amount_per_ngo: hc_amount_per_ngo,
      bh_id: this.bh_id,
      large_donation: this.large_donation,
      charities: this.selected_charity.toString(),
      preference_type: this.preference,
      preference_location: this.location,
      mobileno: this.mobileno,
      country_dial_code: this.country,
      referral_code: referral_code,
      referral_amount: referral_amount,
      verification_type: this.verification_type,
      accept_terms: accept_terms,
      recurring_fees: recurring_fees,
      hg_hc_amount: hg_hc_amount,
      hg_us_amount: hg_us_amount
    };
    
      this.global.createLoader('submitting your request');
      this.userService.verifyUserProfile(data).subscribe(data => {
        this.profileStatus = data.data.profile_status;
  
        // check if profileStatus is null
        if (this.profileStatus !== null && this.profileStatus == 'verified') {
          // gotodashboard
          this.navCtrl.setRoot(HomePage);
        }
  
        // check if msg failed
        if (data.msg == 'failed') {
          this.global.createAlert('', 'Server is unable to submit your request. Please try again later.');
        }
  
        this.global.dismissLoader();
      }, err => {
        console.log(err);
        this.global.dismissLoader();
      });   
  }

  // gotoCharityPage
  gotoCharityPage() {
    this.bh_id_arr = [];
   

    // goto charity page
    const modal = this.modalCtrl.create(CharitiesPage, {
      charities: this.all_charities,
      page: 'userinfo'
    });
    modal.present();

    modal.onDidDismiss((data) => {      
      console.log('view dismiss run successfuly');
      this.bh_id_arr = [];

      // declare emtpy variable
      let charities = [];
      this.all_charities = [];
      this.selected_charity = [];

      // loop of charity
      data.charities.forEach(element => {
        if (element.value == true) {
          // push element to charity arr
          this.selected_charity.push(element.id);
          charities.push(element.name.trim());
        }
        this.all_charities.push(element);
      });

      this.checkCharity = true;
      
      // store selected charities in charities variable
      this.charities = charities;
      
      // get ngo of charities
      if (this.selected_charity.length > 0) {
        this.getBHByCharity(this.selected_charity);
      }
    });
  }

  // calcTransactionFees
  calcTransactionFees(amount: any) {
    return Math.ceil(amount / 100 * 5);
  }

  // calcTotalTransaction
  calcTotalTransaction(amount: any, transactionFees: any) {
    return amount + transactionFees;
  }

  // payment alert
  paymentAlert() {
    const alert = this.alertCtrl.create({
      message: "You are now registered and we will now attempt to withdraw $"+ this.calcTotalTransaction(this.donation_amount, this.calcTransactionFees(this.donation_amount)),
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            let donation_amount = parseInt(this.calcTotalTransaction(this.donation_amount, this.calcTransactionFees(this.donation_amount)));
            // let donation_amount = this.donation_amount;
            let hc_donation_amount = donation_amount * 100;
            let data = {
              'user_id': this.user_id,
              'user_email': this.email,
              'donation_amount': donation_amount,
              'transaction_fees': this.calcTransactionFees(this.donation_amount),
              'hc_donation_amount': hc_donation_amount
            };

            this.global.createLoader('Please wait...');

            // make payment
            this.userService.makePayment(data).subscribe(transactionRes => {
              this.global.dismissLoader();

              // check if transaction res not empty
              if(transactionRes.length < 1 || transactionRes.msg == 'err') {
                this.global.createAlert('',"Withdrawal Unsuccessful, please check the information provided or change to another card.");
              }
              else if(transactionRes.msg == 'success') {
                this.global.createAlert('', "Withdrawal Successful. And we have distributed funds to your selected BigHearts!");
                this.makeServerRequest();
              }
            }, err => {
              this.global.dismissLoader();
              this.global.createAlert('', "Withdrawal Unsuccessful, please check the information provided or change to another card.");
            });            
          }
        },
        {
          text: 'Cancel',
          handler: () => {
            this.global.createAlert('', "Withdrawal Unsuccessful, please check the information provided or change to another card.");
          }
        }
      ]
    });
    alert.present();
  }

  // openWebView
  addPaymentMethod() {
    // check if name or email empty then give alert
    if(this.firstName == null || this.lastName == null || this.email == null) {
      // create validation alert
      this.global.createAlert('', "please fill your name and email to make payment");
    }
    else{
      let fullname = this.firstName+' '+this.lastName;
      let date = new Date();
      let random_no = date.getTime();
      
      // check platform
      if(this.platform.is('ios')) {
        // open link in safari
        const ios_browser = this.iab.create(this.global.base_url('sqpayment/?name='+fullname+'&email='+this.email+'&user_id='+this.user_id+'&unique_no='+random_no), '_system', 'location=yes');
        
        ios_browser.show();

        // create payment card alert
        const ios_alert = this.global.alertCtrl.create({
          title: '',
          message: 'We have open a link in your browser where you can add your card to make donations.',
          buttons: [{
            text: 'Okay',
            handler: () => {
              // checking your card
              this.global.createLoader('Checking your card');

              // set card data to check user card
              const card_data = {
                'user_id': this.user_id
              };

              // get user card
              this.userService.getUserActiveCard(card_data).subscribe(data => {
                // check if unique no mathces
                if(data.unique_no == random_no) {
                  this.card_number = data.card_last_digit;

                  if(this.card_number != "" || this.card_number != null) {
                    this.card_btn = true;
                  }  
                }
                // dismissLoader
                this.global.dismissLoader();
              });
            }
          }]
        });

        // show alert after 1 second
        setTimeout(() => {
          ios_alert.present();  
        }, 1000);        
      }
      else{
        // use fallback browser, example InAppBrowser
        const browser = this.iab.create(this.global.base_url('sqpayment/?name='+fullname+'&email='+this.email+'&user_id='+this.user_id+'&unique_no='+random_no), '_blank', 'location=yes');

        browser.show();      
        
        browser.on('loadstop').subscribe(event => {
          browser.insertCSS({ code: "body{color: #ae0433;}h4{padding: 10px;}" });  
        });      

        browser.on('exit').subscribe(() => {
          // create loader
          this.global.createLoader('Please wait...');

          // set data to get user card
          const card_data = {
            user_id: this.user_id
          };

          // getUserById
          this.userService.getUserActiveCard(card_data).subscribe(data => {
              // check if unique no mathces
              if(data.unique_no == random_no) {
                this.card_number = data.card_last_digit;

                if(this.card_number != "" || this.card_number != null) {
                  this.card_btn = true;
                }  
              }                     

            this.global.dismissLoader();
          }, err => {
            this.global.dismissLoader();
          });
        }, err => {
            console.error(err);
        });
      }
    }    
  }

  // recurringCheck
  recurringCheck() {
    this.recurring_fees = ! this.recurring_fees;
  }
  
  // termsCheck
  termsCheck() {
    this.accept_terms = ! this.accept_terms;
  }

  // getPreferenceCheck
  getPreferenceCheck(country: boolean, region: boolean) {
    this.location = "";
    // check if country and region false
    if (country == false && region == false) {
      this.filterAllBH();
    }
  }

  // filterAllBH
  filterAllBH() {
    this.bh_id_arr = [];

    // check if length of ngo is greater then 0
    if (this.all_bh.length > 0 || this.selected_charity.length > 0) {
      // emtpy all ngo array
      this.all_bh = [];
      this.getBHByCharity(this.selected_charity);
    }
  }

  // reload
  reload() {
    this.splashScreen.show();
    window.location.reload();
  }

  // validateEmail
  validateEmail(mail: string) {
    var validate = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (validate.test(mail)) {
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
  getBHByCharity(selected_charity: any) {
    
    this.global.createLoader('Please wait...');

      // emtpy all ngo array
      this.all_bh = [];

      // getBHByCharityIds
      this.userService.getBHByCharityIds(selected_charity).subscribe(res => {
        
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
              if (element.bh_us_tax_deductible == us_tax_deductible && element.country == this.location) {
                this.all_bh.push(element);
              }
            }
            else if (this.checkRegion == true) {
              let allRegions = this.getCountryOfRegion(this.location);              
              if (allRegions.indexOf(parseInt(element.country)) != -1 && element.bh_us_tax_deductible == us_tax_deductible) {
                this.all_bh.push(element);
              }
            }
            else if (this.checkRegion == false && this.checkCountry == false) {
              // check if elment matched to tax exemption
              if (element.bh_us_tax_deductible == us_tax_deductible) {
                this.all_bh.push(element);
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
              if (element.country == this.location) {
                this.all_bh.push(element);
              }
            }
            else if (this.checkRegion == true) {
              let allRegions = this.getCountryOfRegion(this.location);              
              if (allRegions.indexOf(parseInt(element.country)) != -1) {
                this.all_bh.push(element);
              }
            }
            else if (this.checkRegion == false && this.checkCountry == false) {
              this.all_bh.push(element);
            }
          });
          // console.log('tax exemption else condition');        
        }        

        this.global.dismissLoader();
      }, err => {
        console.log(err);
        this.global.dismissLoader();
      });
  }

  // getCountryFromRegion
  getCountryOfRegion(region_id: any) {
    let bh_arr = [];
    if(this.allRegions.length > 0) {
      this.allRegions.forEach(element => {
        if(element.id == region_id) {
          // convert string to array
          let id_arr = element.country_id.split(",");
          id_arr.forEach(element => {
            bh_arr.push(parseInt(element.trim()));
          });
        }        
      });
    }
    return bh_arr;
  }

  // toLocaleString
  toLocaleString(number: any) {
    return number.toLocaleString();
  }

  // viewBHProfile
  viewBHProfile(bh_id: any) {
    this.navCtrl.push(ProfilePage, {
      bh_id: bh_id,
      page: 'register',
      uuid: this.uuid
    });
  }

  // toast variables
  nameToast: boolean = false;
  policyCheckbox: boolean = false;
  country_region: boolean = false;
  cardToast: boolean = false;
  donationToast: boolean = false;
  campaignToast: boolean = false;  

  // show toast
  showToast(fieldName: string, fval: boolean, msg: string) {
    const infoToast = this.toastCtrl.create({
      message: msg,
      duration: 5000,
      position: 'top',
      closeButtonText: 'Close',
      showCloseButton: true
    });

    // check fieldName
    if(fieldName == 'name' && fval == false) {
      infoToast.present();
      this.nameToast = true;
    }
    else if(fieldName == 'policy'&& fval == false) {
      infoToast.present();
      this.policyCheckbox = true;
    }
    else if(fieldName == 'country_region'&& fval == false) {
      infoToast.present();
      this.country_region = true;
    }
    else if(fieldName == 'card'&& fval == false) {
      infoToast.present();
      this.cardToast = true;
    }
    else if(fieldName == 'donation'&& fval == false) {
      infoToast.present();
      this.donationToast = true;
    }
    else if(fieldName == 'campaign'&& fval == false) {
      infoToast.present();
      this.campaignToast = true;
    }
  }
}
