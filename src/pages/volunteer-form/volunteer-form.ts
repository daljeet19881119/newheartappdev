import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, ModalController, Platform, ViewController } from 'ionic-angular';
import { UserProvider } from '../../providers/user/user';
import { Storage } from '@ionic/storage';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { CharitiesPage } from '../charities/charities';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { GlobalProvider } from '../../providers/global/global';

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

  countries: any;
  loader: any;
  uuid: any;

  // form variables
  userid: any;
  fname: string;
  lname: string;
  email: string;
  volunteerLocation: string;
  fewAboutYourself: string;
  moreAboutYourself: string;
  profilePic: any;
  profilePicName: any;

  contactName1: string = '';
  contactEmail1: string = '';
  contactDesc1: string = '';

  contactName2: string = '';
  contactEmail2: string = '';
  contactDesc2: string = '';

  contactName3: string = '';
  contactEmail3: string = '';
  contactDesc3: string = '';

  contactName4: string = '';
  contactEmail4: string = '';
  contactDesc4: string = '';

  contactName5: string = '';
  contactEmail5: string = '';
  contactDesc5: string = '';

  // variable to store charities
  charities: any = [];
  checkCharity: boolean = false;

  constructor(private transfer: FileTransfer, public navCtrl: NavController, public navParams: NavParams, private userService: UserProvider, private storage: Storage, public loadingCtrl: LoadingController, public alertCtrl: AlertController, private global: GlobalProvider, private camera: Camera, public modalCtrl: ModalController, private platform: Platform, public viewCtrl: ViewController) {

    // get countries from storage
    this.storage.get('countries').then((country) => {
      this.countries = country;
    }).catch((err) => {
      console.log('error: ' + err);
    });

    // get volunteer form data from storage
    this.storage.get('volunteerForm').then((val) => {

      this.userid = val.userid;
      this.fname = val.fname;
      this.lname = val.lname;
      this.email = val.email;
      this.charities = val.charity;
      this.checkCharity = true;
      this.volunteerLocation = val.volunteerLocation;
      this.fewAboutYourself = val.fewAboutYourself;
      this.moreAboutYourself = val.moreAboutYourself;
      this.profilePic = val.profilePic;

      if (val.contact1 != '') {
        // convert string into an array
        let contact1 = val.contact1.split(",");
        this.contactName1 = contact1[0];
        this.contactEmail1 = contact1[1];
        this.contactDesc1 = contact1[2];
      }

      if (val.contact2 != '') {
        let contact2 = val.contact2.split(",");
        this.contactName2 = contact2[0];
        this.contactEmail2 = contact2[1];
        this.contactDesc2 = contact2[2];
      }

      if (val.contact3 != '') {
        let contact3 = val.contact3.split(",");
        this.contactName3 = contact3[0];
        this.contactEmail3 = contact3[1];
        this.contactDesc3 = contact3[2];
      }

      if (val.contact4 != '') {
        let contact4 = val.contact4.split(",");
        this.contactName4 = contact4[0];
        this.contactEmail4 = contact4[1];
        this.contactDesc4 = contact4[2];
      }

      if (val.contact5 != '') {
        let contact5 = val.contact5.split(",");
        this.contactName5 = contact5[0];
        this.contactEmail5 = contact5[1];
        this.contactDesc5 = contact5[2];
      }
    }).catch((err) => {
      console.log(err);
    });

    // if user try goback then go to homepage
    this.platform.registerBackButtonAction(() => {
      this.viewCtrl.dismiss();
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VolunteerFormPage');

    // chec if true uuid
    if (this.global.uuid()) {
      this.uuid = this.global.uuid();
    }
    else {
      this.uuid = 'undefined';
    }

    // request to userProvide
    this.userService.getUserByDeviceId(this.uuid).subscribe(data => {
      this.userid = data.data.id;
    }, err => {
      console.log(err);
    });

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

    this.fname = this.navParams.get('fname');
    this.lname = this.navParams.get('lname');
    this.email = this.navParams.get('email');
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

  // saveData
  saveData() {

    // declare empty array for charity
    let charities = [];

    // loop of selected charity
    this.charities.forEach(element => {

      // remove starting space from each element and push into charity array
      charities.push(element.replace('  ', ''));
    });

    let contact1 = this.contactName1 + ',' + this.contactEmail1 + ',' + this.contactDesc1;
    let contact2 = this.contactName2 + ',' + this.contactEmail2 + ',' + this.contactDesc2;
    let contact3 = this.contactName3 + ',' + this.contactEmail3 + ',' + this.contactDesc3;
    let contact4 = this.contactName4 + ',' + this.contactEmail4 + ',' + this.contactDesc4;
    let contact5 = this.contactName5 + ',' + this.contactEmail5 + ',' + this.contactDesc5;
    let userid = this.userid;

    if (this.fname != null && this.lname != null && this.email != null && this.volunteerLocation != null && this.fewAboutYourself != null && this.moreAboutYourself != null && charities.length != 0) {
      // check if email is valid
      if (this.validateEmail(this.email) == true) {
        this.createLoader();
        
        const postdata = {
          userid: userid,
          fname: this.fname,
          lname: this.lname,
          email: this.email,
          charity: charities,
          volunteer_location: this.volunteerLocation,
          few_about_yourself: this.fewAboutYourself,
          more_about_yourself: this.moreAboutYourself,
          profile_pic: this.profilePicName,
          contact1: contact1,
          contact2: contact2,
          contact3: contact3,
          contact4: contact4,
          contact5: contact5
        };
        // request to server
        this.userService.saveVolunteerFormData(postdata).subscribe(data => {
          // alert(data.msg);
          this.setDataToStorage(userid, this.fname, this.lname, this.email, charities, this.volunteerLocation, this.fewAboutYourself, this.moreAboutYourself, this.profilePic, contact1, contact2, contact3, contact4, contact5);

          this.loader.dismiss();
        }, err => {
          console.log('error: ' + err);
          this.loader.dismiss();
        });
      }
      else {
        alert("please enter valid email.");
      }
    }
    else {
      this.createAlert();
    }
  }

  // createAlert
  createAlert() {
    const alert = this.alertCtrl.create({
      message: 'Please fill out the required fields.',
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

  // setDataToStorage
  setDataToStorage(userid: number, fname: string, lname: string, email: string, charity: any, volunteerLocation: string, fewAboutYourself: string, moreAboutYourself: string, profilePic: string, contact1: string = '', contact2: string = '', contact3: string = '', contact4: string = '', contact5: string = '') {
    let data = {
      userid: userid,
      fname: fname,
      lname: lname,
      email: email,
      charity: charity,
      volunteerLocation: volunteerLocation,
      fewAboutYourself: fewAboutYourself,
      moreAboutYourself: moreAboutYourself,
      profilePic: profilePic,
      contact1: contact1,
      contact2: contact2,
      contact3: contact3,
      contact4: contact4,
      contact5: contact5
    };

    this.storage.set('volunteerForm', data);
  }

  // take picture
  tackPicture() {

    // empty testpic
    this.profilePic = '';

    this.createLoader();

    const options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      targetHeight: 900,
      targetWidth: 900
    }

    let date = new Date();
    let timeStr = date.getTime();

    const fileTransfer: FileTransferObject = this.transfer.create();
    let uploadOptions: FileUploadOptions = {
      fileKey: 'file',
      fileName: timeStr + '_volunteer.jpg',
      headers: {}
    }

    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      let base64Image = 'data:image/jpeg;base64,' + imageData;
      this.profilePicName = timeStr + '_volunteer.jpg';

      // send file to server
      fileTransfer.upload(base64Image, this.global.SITE_URL + '/image-upload.php', uploadOptions).then((data) => {
        // alert('data'+data.response);
        this.profilePic = this.global.SITE_URL + '/imgs/volunteer-form/' + timeStr + '_volunteer.jpg';
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
  uploadPicture() {

    // empty testpic
    this.profilePic = '';

    this.createLoader();

    const options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      saveToPhotoAlbum: false,
      targetHeight: 900,
      targetWidth: 900
    }

    let date = new Date();
    let timeStr = date.getTime();

    const fileTransfer: FileTransferObject = this.transfer.create();
    let uploadOptions: FileUploadOptions = {
      fileKey: 'file',
      fileName: timeStr + '_volunteer.jpg',
      headers: {}
    }

    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      let base64Image = 'data:image/jpeg;base64,' + imageData;
      this.profilePicName = timeStr + '_volunteer.jpg';

      // send file to server
      fileTransfer.upload(base64Image, this.global.SITE_URL + '/image-upload.php', uploadOptions).then((data) => {
        // alert('data'+data.response);
        this.profilePic = this.global.SITE_URL + '/imgs/volunteer-form/' + timeStr + '_volunteer.jpg';
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

  // gotoCharityPage
  gotoCharityPage() {

    // declare empty array for charity
    let charities = [];

    // loop of selected charity
    this.charities.forEach(element => {

      // remove starting space from each element and push into charity array
      charities.push(element.replace('  ', ''));
    });

    // create modal
    const modal = this.modalCtrl.create(CharitiesPage, {
      charities: charities,
      page: 'volunteer-form',
      fname: this.fname,
      lname: this.lname,
      email: this.email
    });
    modal.present();
  }
}
