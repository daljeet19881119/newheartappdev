import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Platform, Navbar, Select, AlertController } from 'ionic-angular';
import { GlobalProvider } from '../../providers/global/global';
import { UserProvider } from '../../providers/user/user';
import { CharitiesPage } from '../charities/charities';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { FileTransfer, FileTransferObject, FileUploadOptions } from '@ionic-native/file-transfer';
import { HomePage } from '../home/home';
import { SigninPage } from '../signin/signin';
import { CardDetailsPage } from '../card-details/card-details';


@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {
  @ViewChild('navbar') navBar: Navbar;
  @ViewChild('selectCountry') selectCountry: Select;

  fname: string;
  lname: string;
  mobileno: any;
  email: string;
  phone_code: number;
  email_code: number;
  email_verification_code: number = null;
  phone_verifciation_code: number = null;
  verification_type: string;  
  charities: any = [];
  checkCharity: boolean = false;
  all_countries: any = [];
  dial_code: any;
  old_dial_code: any;
  all_regions: any = [];
  preference_type: string;
  profile_pic: any = '';
  profile_pic_src: any;
  userid: any;

  uuid: any;
  old_mobno: any;
  old_email: any;
  country: any;
  region: any;

  
  selected_charity: any = [];
  all_charites: any = [];
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
  current_password: string ="";
  new_password: string ="";
  confirm_password: string ="";
  userObj: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, private global: GlobalProvider, private userService: UserProvider, private modalCtrl: ModalController, private camera: Camera, private transfer: FileTransfer, private platform: Platform, public alertCtrl: AlertController) {

    // if user try goback then go to homepage
    this.platform.registerBackButtonAction(() => {
      this.updateUserData();
      this.navCtrl.setRoot(HomePage);
      this.navCtrl.pop();
    });    
  }

  ionViewWillLeave() {
    this.updateUserData();
  }

  ionViewDidLoad() {
    // navbar backbutton click
    this.navBar.backButtonClick = () => {
      this.updateUserData();
      this.navCtrl.pop();
    };

    console.log('ionViewDidLoad SettingsPage');

    // store uuid
    if (this.global.uuid()) {
      this.uuid = this.global.uuid();
    }
    else {
      this.uuid = 'undefined';
    }

    // call getUserData
    this.getUserData();

    // call getCountries
    this.getCountries();

    // call getRegions
    this.getRegions();
  }

  // incrementDonation
  incrementDonation() {
    if(this.donation_amount < 25) {      
      this.donation_amount = this.donation_amount + 5;
      this.donation_amount = 25;
    }
    if (this.donation_amount < 500 && this.donation_amount >= 25) {
      this.donation_amount = this.donation_amount + 25;
    }
    else if (this.donation_amount >= 500 && this.donation_amount <= 950) {
      this.donation_amount = this.donation_amount + 50;
    }

    if (this.donation_amount > 25 && this.donation_amount < 950) {
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

  // getUserData
  getUserData() {
    // call createLoader
    this.global.createLoader("Loading...");

    this.userService.getUserByDeviceId(this.uuid).subscribe(data => {
      // check if msg success
      if (data.msg == 'success') {
        this.userObj = data.data;
        this.fname = data.data.fname;
        this.lname = data.data.lname;
        this.mobileno = data.data.mobile_no;
        this.old_mobno = data.data.mobile_no;
        this.old_email = data.data.email;
        this.email = data.data.email;
        this.verification_type = data.data.verification_type;
        this.cause_percentage = parseInt(data.data.cause_percentage);
        this.preference_type = data.data.preference_type;

        // check cuase gauge meter
        if(this.cause_percentage <= 5) {
          this.disableCauseMinusBtn = true;
          this.disableCausePlusBtn = false;
        }
        if(this.cause_percentage > 5 && this.cause_percentage < 85){
          this.disableCausePlusBtn = false;
          this.disableCauseMinusBtn = false;
        }
        if(this.cause_percentage >= 85) {
          this.disableCausePlusBtn = true;
          this.disableCauseMinusBtn = false;
        }
        
        if(this.preference_type == 'country') {
          this.country = data.data.country;
        }
        else if(this.preference_type == 'region') {
          this.region = data.data.region;
        }
        else if(this.preference_type == 'both') {
          this.country = data.data.country;
          this.region = data.data.region;
        }
        
        this.userid = data.data.user_id;
        this.profile_pic_src = data.data.profile_pic_src;
        this.dial_code = data.data.country_dial_code;
        this.old_dial_code = data.data.country_dial_code;
        this.donation_amount = parseInt(data.data.us_donation_amount);
        
        // check donation gauge meter
        if (this.donation_amount <= 25) {
          this.disableMinusBtn = true;
          this.disablePlusBtn = false;
        }
        if(this.donation_amount > 25 && this.donation_amount < 950) {
          this.disableMinusBtn = false;
          this.disablePlusBtn = false;
        }
        if (this.donation_amount >= 950) {
          this.disableMinusBtn = false;
          this.disablePlusBtn = true;
        }
        
        let selected_charity_id: any = [];
        data.selected_charities.forEach(element => {
          // string to array conversion
          this.charities.push(element.name.trim());
          selected_charity_id.push(element.id);
        });
        
        // call getCharities
        this.getCharities(selected_charity_id);
        
        this.checkCharity = true;
      }

      this.global.dismissLoader();
    }, err => {
      this.global.dismissLoader();
      console.log(err);
    });
  }

  // updateUserData
  updateUserData() {

    if (this.email_verification_code != null && this.email_code != this.email_verification_code) {
      this.global.createAlert('',"Your email verification code does not matched.");
    }
    else if (this.phone_verifciation_code != null && this.phone_code != this.phone_verifciation_code) {
      this.global.createAlert('',"Your phone number verification code does not matched.");
    }
    else {
      // declare check variable for checking condition
      let check = false;

      // check verification type of email
      if (this.verification_type == 'email' && this.email != '') {
        check = true;
      }

      // check veification type of mobileno
      if (this.verification_type == 'mobileno' && this.mobileno != '') {
        check = true;
      }
      // check veification type for both
      if (this.verification_type == 'both' && this.mobileno != '' && this.email != '') {
        check = true;
      }

      // validate data
      if (this.fname == '' || this.lname == '' || check == false) {
        this.global.createAlert('',"Please fill out all fields marked with (*)");
      }
      else {
        // call createLoader
        // this.global.createLoader('Settings Saved');

        // calculate hc percentage
        let hc_percentage = 100 - this.cause_percentage;

        // check if prefrence type is empty
        if (this.country != "" && this.region !="") {
          this.preference_type = 'both';
        }


        // set data to be send
        let data = {
          userid: this.userid,
          uuid: this.uuid,
          fname: this.fname,
          lname: this.lname,
          email: this.email,
          mobileno: this.mobileno,
          country_dial_code: this.dial_code,
          cause_percentage: this.cause_percentage,
          preference_type: this.preference_type,
          country: this.country,
          region: this.region,
          charities: this.selected_charity,
          hc_percentage: hc_percentage,
          profile_pic: this.profile_pic,
          donation_amount: this.donation_amount
        };

        this.userService.updateUserInfo(data).subscribe(data => {
          // check if data successfuly updated
          if (data.msg == 'success') {
            this.fname = data.fname;
            this.lname = data.lname;
            this.email = data.email;
            this.mobileno = data.mobile_no;
            this.cause_percentage = data.cause_percentage;
            this.country = data.country;
            this.region = data.region;
            
            this.profile_pic_src = data.profile_pic_src;
            this.email_verification_code = null;
            this.phone_verifciation_code = null;
          }

          if (data.msg == 'exists') {
            this.global.createAlert('',"The mobile no or email you have entered is already exists.");
          }

          if (data.length < 1) {
            this.global.createAlert('',"Server is unable to handle your request. Please try again later.");
          }

          // this.global.dismissLoader();
        }, err => {
          // this.global.dismissLoader();
          console.log(err);
        });
      }
    }
  }

  // sendVerificationCode
  sendVerificationCode() {
    // send sms mobileno not empty
    if (this.mobileno != '' && this.mobileno != this.old_mobno) {

      let message = `We've sent an SMS with an activation code to your phone <b>+${this.dial_code + ' ' + this.old_mobno}</b>`;

      // create alert
      this.global.createAlert('', message);

      // set sms verification data
      let data = {
        country_dial_code: this.dial_code,
        mobileno: this.old_mobno
      };

      this.userService.sendVerificationCode(data).subscribe(code => {
        this.phone_verifciation_code = parseInt(code);
        this.old_mobno = this.mobileno;
      });
    }
  }

  // countryCodeChange
  countryCodeChange() {
    // send sms mobileno not empty
    if (this.dial_code != '' && this.dial_code != this.old_dial_code) {

      let message = `We've sent an SMS with an activation code to your phone <b>+${this.dial_code + ' ' + this.mobileno}</b>`;

      // create alert
      this.global.createAlert('', message);

      // set sms verification data
      let data = {
        country_dial_code: this.dial_code,
        mobileno: this.mobileno
      };

      this.userService.sendVerificationCode(data).subscribe(code => {
        this.phone_verifciation_code = parseInt(code);
        this.old_mobno = this.mobileno;
      });
    }
  }

  // sendVerificationEmail
  sendVerificationEmail() {
    // send email if not empty
    if (this.email != '' && this.email != this.old_email) {
      let message = `We've sent an email with an activation code to your email <b>${this.old_email}</b>`;

      // create alert
      this.global.createAlert('', message);

      // set email verification data
      let data = {
        email: this.old_email
      };

      this.userService.sendVerificationEmail(data).subscribe(code => {
        this.email_verification_code = parseInt(code);
        this.old_email = this.email;
      });
    }
  }

  // getCountries
  getCountries() {
    this.userService.getAllCountries().subscribe(data => {
      this.all_countries = data;
    }, err => {
      console.log(err);
    });
  }

  // getRegions
  getRegions() {
    this.userService.getAllRegions().subscribe(data => {
      this.all_regions = data;
    }, err => {
      console.log(err);
    });
  }

  // getCharites
  getCharities(selected_charity: any) {
    this.userService.getAllCharities().subscribe(charities => {

      charities.forEach(element => {
          if(selected_charity.indexOf(element.id) != -1) {
            element.value = true;
            this.selected_charity.push(parseInt(element.id));
          }
          else{
            element.value = false;
          }
      });
      this.all_charites = charities;
    }, err => console.log(err));
  }

  // gotoCharityPage
  gotoCharityPage() {
    // goto charity page
    const modal = this.modalCtrl.create(CharitiesPage, {
      charities: this.all_charites,
      page: 'settings'
    });
    modal.present();

    modal.onDidDismiss((data) => {
      console.log('view dismiss run successfuly');

      // declare empty array for charity
      let charities = [];
      this.selected_charity = [];

      // loop of charity
      data.charities.forEach(element => {
        if (element.value == true) {
          // push element to charity arr
          charities.push(element.name.trim());
          this.selected_charity.push(parseInt(element.id));
        }
      });

      this.checkCharity = true;

      // store selected charities in charities variable
      this.charities = charities;

    });
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

  // take picture
  tackPicture() {

    // empty testpic
    this.profile_pic = '';

    this.global.createLoader('Please wait...');

    const options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      targetHeight: 900,
      targetWidth: 900,
      correctOrientation: true
    }

    let date = new Date();
    let timeStr = date.getTime();

    const fileTransfer: FileTransferObject = this.transfer.create();
    let uploadOptions: FileUploadOptions = {
      fileKey: 'file',
      fileName: timeStr + '_user.jpg',
      headers: {}
    }

    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      let base64Image = 'data:image/jpeg;base64,' + imageData;
      this.profile_pic = timeStr + '_user.jpg';

      // send file to server
      fileTransfer.upload(base64Image, this.global.apiUrl('/uploadImage'), uploadOptions).then((data) => {
        // alert('data'+data.response);
        this.profile_pic_src = this.global.base_url('assets/images/'+ timeStr + '_user.jpg');
        this.global.dismissLoader();
      }).catch((err) => {
        // alert('Server is unable to upload your image please try again later.');
        this.global.dismissLoader();
      });
    }, (err) => {
      // Handle error
      console.log(err);
      this.global.dismissLoader();
    });
  }

  // take picture
  choosePicture() {
    // empty testpic
    this.profile_pic = '';

    this.global.createLoader('Please wait...');

    const options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      saveToPhotoAlbum: false,
      targetHeight: 900,
      targetWidth: 900,
      correctOrientation: true
    }

    let date = new Date();
    let timeStr = date.getTime();

    const fileTransfer: FileTransferObject = this.transfer.create();
    let uploadOptions: FileUploadOptions = {
      fileKey: 'file',
      fileName: timeStr + '_user.jpg',
      headers: {}
    }

    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      let base64Image = 'data:image/jpeg;base64,' + imageData;
      this.profile_pic = timeStr + '_user.jpg';

      // send file to server
      fileTransfer.upload(base64Image, this.global.apiUrl('/uploadImage'), uploadOptions).then((data) => {
        // alert('data'+data.response);
        this.profile_pic_src = this.global.base_url('assets/images/'+ timeStr + '_user.jpg');
        this.global.dismissLoader();
      }).catch((err) => {
        // alert('Server is unable to upload your image please try again later.');
        this.global.dismissLoader();
      });
    }, (err) => {
      // Handle error
      console.log(err);
      this.global.dismissLoader();
    });

  }

  // toLocaleString
  toLocaleString(number: any) {
    return number.toLocaleString();
  }

  // open country 
  openCountry() {
    this.selectCountry.open();
  }

  // chagePassword
  changePassword() {
    if(this.current_password =="" || this.new_password == "" || this.confirm_password == "")
    {
      this.global.createAlert('','Please type your current password and new password to update your password.');
    }
    else{
      if(this.new_password != this.confirm_password) {
        this.global.createAlert('','Your new password and confirm password did not matched.');
      }
      else{
        // set data
        const data = {
          'email': this.email,
          'current_password': this.current_password,
          'new_password': this.new_password
        };

        this.userService.updatePassword(data).subscribe(data => {
           if(data.msg == 'success') {
              const alert = this.alertCtrl.create({
                message: 'Your password updated successfully.',
                buttons: [{
                  text: 'ok',
                  handler: () => {
                    this.logout();
                  }
                }]
              });      
              alert.present();        
           }
           else{
             this.global.createAlert('','Your current password did not matched.');
           }
        });
      }
    }
  }

  // logout
  logout() {
    this.global.createLoader();

    const uuid = this.global.uuid();
    this.userService.logout(uuid).subscribe(data => {
      if(data.msg == 'success') {
        this.navCtrl.setRoot(SigninPage);
      }
      this.global.dismissLoader();      
    });    
  }

  // cardDetailPage
  cardDetailPage() {
    this.navCtrl.push(CardDetailsPage, {userObj: this.userObj});
  }
}
