import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ModalController, AlertController } from 'ionic-angular';
import { GlobalProvider } from '../../providers/global/global';
import { UserProvider } from '../../providers/user/user';
import { CharitiesPage } from '../charities/charities';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { FileTransfer, FileTransferObject, FileUploadOptions } from '@ionic-native/file-transfer';


@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  fname: string;
  lname: string;
  mobileno: any;
  email: string;
  verification_type: string;
  cause_percentage: any;
  charities: any = [];
  checkCharity: boolean = false;
  all_countries: any = [];
  all_regions: any = [];
  preference_type: string;
  preference_location: any;
  profile_pic: any;
  profile_pic_src: any;
  userid: any;

  uuid: any;
  loader: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, private global: GlobalProvider, private userService: UserProvider, private loadingCtrl: LoadingController, private modalCtrl: ModalController, private camera: Camera, private transfer: FileTransfer, private alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
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
        this.mobileno = data.data.mobileno;
        this.email = data.data.email;
        this.verification_type = data.data.verification_type;
        this.cause_percentage = data.data.cause_percentage;
        this.preference_type = data.data.preference_type;
        this.preference_location = data.data.preference_location;
        this.userid = data.data.id;
        this.profile_pic_src = data.data.profile_pic_src;

        // string to array conversion
        this.charities = data.data.charity_type;
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
      this.createLoader('submitting your request');

      // calculate hc percentage
      let hc_percentage = 100 - parseInt(this.cause_percentage);

      // set data to be send
      let data = {
        userid: this.userid,
        uuid: this.uuid,
        fname: this.fname,
        lname: this.lname,
        email: this.email,
        mobileno: this.mobileno,
        cause_percentage: this.cause_percentage,
        preference_location: this.preference_location,
        hc_percentage: hc_percentage,
        profile_pic: this.profile_pic
      };

      this.userService.updateUserInfo(data).subscribe(data => {
        // check if data successfuly updated
        if (data.msg == 'success') {
          this.fname = data.fname;
          this.lname = data.lname;
          this.email = data.email;
          this.mobileno = data.mobileno;
          this.cause_percentage = data.cause_percentage;
          this.preference_location = data.preference_location;
          this.profile_pic_src = data.data.profile_pic_src;
        }
        else {
          this.createAlert("Server is unable to handle your request. Please try again later.");
        }

        this.loader.dismiss();
      }, err => {
        this.loader.dismiss();
        console.log(err);
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

  // gotoCharityPage
  gotoCharityPage() {

    // declare empty array for charity
    let charities = [];

    // check if string
    if (typeof (this.charities) == 'string') {
      // convert string to array
      this.charities = this.charities.split(',');
    }

    // loop of selected charity
    this.charities.forEach(element => {

      // remove starting space from each element and push into charity array
      charities.push(element.trim());
    });

    // goto charity page
    const modal = this.modalCtrl.create(CharitiesPage, {
      charities: charities,
      page: 'settings'
    });
    modal.present();

    modal.onDidDismiss((data) => {
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
      }
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
      fileTransfer.upload(base64Image, this.global.SITE_URL + '/cause-form-image-upload.php', uploadOptions).then((data) => {
        // alert('data'+data.response);
        this.profile_pic_src = this.global.SITE_URL + '/imgs/cause-form/' + timeStr + '_user.jpg';
        this.loader.dismiss();
      }).catch((err) => {
        alert('Server is unable to upload your image please try again later.');
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
      fileTransfer.upload(base64Image, this.global.SITE_URL + '/cause-form-image-upload.php', uploadOptions).then((data) => {
        // alert('data'+data.response);
        this.profile_pic_src = this.global.SITE_URL + '/imgs/cause-form/' + timeStr + '_user.jpg';
        this.loader.dismiss();
      }).catch((err) => {
        alert('Server is unable to upload your image please try again later.');
        this.loader.dismiss();
      });
    }, (err) => {
      // Handle error
      console.log(err);
      this.loader.dismiss();
    });

  }
}
