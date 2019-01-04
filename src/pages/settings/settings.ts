import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ModalController, AlertController, Platform, Navbar } from 'ionic-angular';
import { GlobalProvider } from '../../providers/global/global';
import { UserProvider } from '../../providers/user/user';
import { CharitiesPage } from '../charities/charities';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { FileTransfer, FileTransferObject, FileUploadOptions } from '@ionic-native/file-transfer';
import { HomePage } from '../home/home';


@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {
  @ViewChild('navbar') navBar: Navbar;

  fname: string;
  lname: string;
  mobileno: any;
  email: string;
  phone_code: number;
  email_code: number;
  email_verification_code: number = null;
  phone_verifciation_code: number = null;
  verification_type: string;
  cause_percentage: any;
  charities: any = [];
  checkCharity: boolean = false;
  all_countries: any = [];
  dial_code: any;
  country_code: any;
  all_regions: any = [];
  preference_type: string;
  preference_location: any;
  profile_pic: any = '';
  profile_pic_src: any;
  userid: any;

  uuid: any;
  loader: any;
  old_mobno: any;
  old_email: any;
  donation_amount: any = 20;
  selected_charity: any = [];
  all_charites: any = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, private global: GlobalProvider, private userService: UserProvider, private loadingCtrl: LoadingController, private modalCtrl: ModalController, private camera: Camera, private transfer: FileTransfer, private alertCtrl: AlertController, private platform: Platform) {

    // if user try goback then go to homepage
    this.platform.registerBackButtonAction(() => {
      this.updateUserData();
      this.navCtrl.setRoot(HomePage);
      this.navCtrl.pop();
    });    
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

  // getUserData
  getUserData() {
    // call createLoader
    this.createLoader("Loading...");

    this.userService.getUserByDeviceId(this.uuid).subscribe(data => {
      // check if msg success
      if (data.msg == 'success') {
        this.fname = data.data.fname;
        this.lname = data.data.lname;
        this.mobileno = data.data.mobile_no;
        this.old_mobno = data.data.mobile_no;
        this.old_email = data.data.email;
        this.email = data.data.email;
        this.verification_type = data.data.verification_type;
        this.cause_percentage = data.data.cause_percentage;
        this.preference_type = data.data.preference_type;

        if(this.preference_type == 'country') {
          this.preference_location = data.data.country;
        }
        else if(this.preference_type == 'region') {
          this.preference_location = data.data.region;
        }
        
        this.userid = data.data.user_id;
        this.profile_pic_src = data.data.profile_pic_src;
        this.dial_code = data.data.country_dial_code;
        this.donation_amount = data.data.us_donation_amount;
        
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

      this.loader.dismiss();
    }, err => {
      this.loader.dismiss();
      console.log(err);
    });
  }

  // updateUserData
  updateUserData() {

    if (this.email_verification_code != null && this.email_code != this.email_verification_code) {
      this.createAlert("Your email verification code does not matched.");
    }
    else if (this.phone_verifciation_code != null && this.phone_code != this.phone_verifciation_code) {
      this.createAlert("Your phone number verification code does not matched.");
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


      // validate data
      if (this.fname == '' || this.lname == '' || check == false) {
        this.createAlert("Please fill out all fields marked with (*)");
      }
      else {
        // call createLoader
        this.createLoader('Settings Saved');

        // calculate hc percentage
        let hc_percentage = 100 - parseInt(this.cause_percentage);

        let preference_type = this.preference_type;

        // check if prefrence type is empty
        if (this.preference_type == "") {
          preference_type = 'region';
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
          preference_location: this.preference_location,
          hc_percentage: hc_percentage,
          profile_pic: this.profile_pic,
          preference_type: preference_type,
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

            if(data.preference_type == 'country') {
              this.preference_location = data.country;
            }
            else if(data.preference_type == 'region') {
              this.preference_location = data.region;
            }
            
            this.profile_pic_src = data.profile_pic_src;
            this.email_verification_code = null;
            this.phone_verifciation_code = null;
          }

          if (data.msg == 'exists') {
            this.createAlert("The mobile no or email you have entered is already exists.");
          }

          if (data.length < 1) {
            this.createAlert("Server is unable to handle your request. Please try again later.");
          }

          this.loader.dismiss();
        }, err => {
          this.loader.dismiss();
          console.log(err);
        });
      }
    }
  }

  // sendVerificationCode
  sendVerificationCode() {
    // send sms mobileno not empty
    if (this.mobileno != '' && this.mobileno != this.old_mobno) {

      let message = `We've sent an SMS with an activation code to your phone <b>+${this.dial_code + ' ' + this.mobileno}</b>`;

      // create alert
      this.createAlert(message);

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
      let message = `We've sent an email with an activation code to your email <b>${this.email}</b>`;

      // create alert
      this.createAlert(message);

      // set email verification data
      let data = {
        email: this.email
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

      // GET COUNTRY DIAL CODE BY ITS CODE
      data.forEach(element => {
        if (element.code == this.country_code) {
          this.dial_code = element.dial_code;
        }
      });
    }, err => {
      console.log(err);
    });
  }

  // function to getCountryCode
  getCountryDialCode(code: string) {

    // call user service provider to get country code
    this.userService.getCountryCodeByCode(code).subscribe(data => {
      this.dial_code = data.dial_code;

      // dismiss laoder
      this.loader.dismiss();
    }, err => {
      console.log('Oops!' + err);
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
          this.selected_charity.push(element.id);
        }
      });

      this.checkCharity = true;

      // store selected charities in charities variable
      this.charities = charities;

    });
  }

  // createLoader
  createLoader(msg: string) {
    this.loader = this.loadingCtrl.create({
      content: msg,
      spinner: 'dots'
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

    this.createLoader('Please wait...');

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
        this.loader.dismiss();
      }).catch((err) => {
        // alert('Server is unable to upload your image please try again later.');
        this.loader.dismiss();
      });
    }, (err) => {
      // Handle error
      console.log(err);
      this.loader.dismiss();
    });
  }

  // take picture
  choosePicture() {
    // empty testpic
    this.profile_pic = '';

    this.createLoader('Please wait...');

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
        this.loader.dismiss();
      }).catch((err) => {
        // alert('Server is unable to upload your image please try again later.');
        this.loader.dismiss();
      });
    }, (err) => {
      // Handle error
      console.log(err);
      this.loader.dismiss();
    });

  }

  // toLocaleString
  toLocaleString(number: any) {
    return number.toLocaleString();
  }
}
