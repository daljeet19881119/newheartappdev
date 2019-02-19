import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Platform, ViewController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { UserProvider } from '../../providers/user/user';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { CharitiesPage } from '../charities/charities';
import { ImagePicker, ImagePickerOptions } from '@ionic-native/image-picker';
import { GlobalProvider } from '../../providers/global/global';
import { HomePage } from '../home/home';

@IonicPage()
@Component({
  selector: 'page-cause-form',
  templateUrl: 'cause-form.html',
})
export class CauseFormPage {

  countries: any;
  fname: string;
  lname: string;
  country: string ='';
  city: string = '';
  fewAboutYourself: string;
  moreAboutYourself: string;
  email: string;

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

  userid: any;
  uuid: any;
  profilePic: any;
  profilePicName: any = "";
  multiplePics: any;
  multiplePicsArr: any = [];

  // varibale for checking that what the user have selected
  prefType: any;
  region: any;
  regionId: any = '';


  // variable to store charities
  charities: any = [];
  checkCharity: boolean = false;
  bank_name: string;
  account_no: any;
  ifsc_code: any;
  paypal_email: any;
  us_tax_deductible: boolean = false;
  all_charities: any = [];
  selected_charity: any = [];
  all_regions: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage, private userService: UserProvider, private global: GlobalProvider, private camera: Camera, private transfer: FileTransfer, public modalCtrl: ModalController, private platform: Platform, private imagePicker: ImagePicker, public viewCtrl: ViewController) {

 
    // get data from storage
    this.storage.get('causeForm').then((val) => {
      this.userid = val.userid;
      this.fname = val.fname;
      this.lname = val.lname;
      this.email = val.email;
      this.bank_name = val.bank_name;
      this.account_no = val.account_no;
      this.ifsc_code = val.ifsc_code;
      this.paypal_email = val.paypal_email;
      this.charities = val.causeCat;
      this.checkCharity = true;
      this.country = val.country;
      this.city = val.city;
      this.fewAboutYourself = val.fewAboutYourself;
      this.moreAboutYourself = val.moreAboutYourself;
      this.profilePic = val.profilePic;
      this.multiplePicsArr = val.multiplePics;

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
      this.navCtrl.setRoot(HomePage);
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CauseFormPage');
    // get device id
    this.getDeviceID();
  }

  // getDeviceID
  getDeviceID() {
    if (this.global.uuid()) {
      this.uuid = this.global.uuid();
    }
    else {
      this.uuid = 'undefined';
    }

    // request to userProvide
    this.userService.getUserByDeviceId(this.uuid).subscribe(data => {
      this.userid = data.data.user_id;
      this.prefType = data.data.preference_type;
      this.email = data.data.email;
      this.fname = data.data.fname;
      this.lname = data.data.lname;
      
      // put value if it is country
      if (this.prefType == 'country') {
        this.country = data.data.country;

        this.getCountries();
      }

      // put value if it is region
      if (this.prefType == 'region' || this.prefType == "") {
        this.regionId = data.data.region;
        
        this.getRegions();        
      }
    }, err => {
      console.log(err);
    });
  }

  // saveData
  saveData() {

    let contact1: any = {
      c_name: this.contactName1,
      c_email: this.contactEmail1,
      c_desc: this.contactDesc1
    };

    let contact2: any = {
      c_name: this.contactName2,
      c_email: this.contactEmail2,
      c_desc: this.contactDesc2
    };

    let contact3: any = {
      c_name: this.contactName3,
      c_email: this.contactEmail3,
      c_desc: this.contactDesc3
    };

    let contact4: any = {
      c_name: this.contactName4,
      c_email: this.contactEmail4,
      c_desc: this.contactDesc4
    };

    let contact5: any = {
      c_name: this.contactName5,
      c_email: this.contactEmail5,
      c_desc: this.contactDesc5
    };

    let userid = this.userid;


    if (this.fname != null && this.lname != null && this.email != null && this.fewAboutYourself != null && this.moreAboutYourself != null && this.charities.length != 0) {

      // check if valid mail
      if (this.validateEmail(this.email) == true) {

        // call func createLoader
        this.global.createLoader('Settings saved');

        const data = {
          userid: userid,
          fname: this.fname,
          lname: this.lname,
          email: this.email,
          bank_name: this.bank_name,
          account_no: this.account_no,
          ifsc_code: this.ifsc_code,
          paypal_email: this.paypal_email,
          cause_category: this.selected_charity,
          us_tax_deductible: this.us_tax_deductible,
          country: this.country,
          region: this.regionId,
          city: this.city,
          few_about_yourself: this.fewAboutYourself,
          more_about_yourself: this.moreAboutYourself,
          profile_pic: this.profilePicName,
          pics_n_video: this.multiplePics,
          contact1: contact1,
          contact2: contact2,
          contact3: contact3,
          contact4: contact4,
          contact5: contact5
        };

        // request user provider
        this.userService.saveCauseFormData(data).subscribe(data => {

          if (data.msg == 'success') {
            this.setDataToStorage(userid, this.fname, this.lname, this.email, this.bank_name, this.account_no, this.ifsc_code, this.paypal_email, this.charities, this.country, this.regionId, this.city, this.fewAboutYourself, this.moreAboutYourself, this.profilePic, this.multiplePicsArr, contact1, contact2, contact3, contact4, contact5);
          }
          if (data.msg == 'success' && data.status == 'processing') {
            this.global.createAlert('','We have already received your request and will return when it is processed. <p>Thank you.</p>');
          }
          
          this.global.dismissLoader();
        }, err => {
          console.log('error: ' + err);
          this.global.dismissLoader();
        });
      }
      else {
        alert("please enter valid email");
      }
    }
    else {
      this.global.createAlert('','Please fill out the required fields.');
    }
  }

  // setDataToStorage
  setDataToStorage(userid: number, fname: string, lname: string, email: string, bank_name: string, account_no: any, ifsc_code: any, paypal_email: any, charities: any, country: any, region: any, city: string, fewAboutYourself: string, moreAboutYourself: string, profilePic: string, multiplePics: any, contact1: string = '', contact2: string = '', contact3: string = '', contact4: string = '', contact5: string = '') {
    let data = {
      userid: userid,
      fname: fname,
      lname: lname,
      email: email,
      bank_name: bank_name,
      account_no: account_no,
      ifsc_code: ifsc_code,
      paypal_email: paypal_email,
      causeCat: charities,
      country: country,
      region: region,
      city: city,
      fewAboutYourself: fewAboutYourself,
      moreAboutYourself: moreAboutYourself,
      profilePic: profilePic,
      multiplePics: multiplePics,
      contact1: contact1,
      contact2: contact2,
      contact3: contact3,
      contact4: contact4,
      contact5: contact5
    };

    this.storage.set('causeForm', data);
  }

  // take picture
  takePicture() {

    // empty testpic
    this.profilePic = '';

    this.global.createLoader();

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
      fileName: timeStr + '_cause.jpg',
      headers: {}
    }

    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      let base64Image = 'data:image/jpeg;base64,' + imageData;
      this.profilePicName = timeStr + '_cause.jpg';

      // send file to server
      fileTransfer.upload(base64Image, this.global.apiUrl('/uploadImage'), uploadOptions).then((data) => {
        
        let res = JSON.parse(data.response);

        // if success
        if(res.msg == "success") {
          this.profilePic = this.global.base_url('assets/images/'+ timeStr + '_cause.jpg');
        }
        
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
    this.profilePic = '';

    this.global.createLoader();

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
      fileName: timeStr + '_cause.jpg',
      headers: {}
    }

    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      let base64Image = 'data:image/jpeg;base64,' + imageData;
      this.profilePicName = timeStr + '_cause.jpg';

      // send file to server
      fileTransfer.upload(base64Image, this.global.apiUrl('/uploadImage'), uploadOptions).then((data) => {
        let res = JSON.parse(data.response);

        // if success 
        if(res.msg == "success") {
          this.profilePic = this.global.base_url('assets/images/'+ timeStr + '_cause.jpg');
        }

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

  // chooseMultiplePicture
  chooseMultiplePicture() {
    // check if image length < 5
    if (this.multiplePicsArr.length < 5) {
      const options: ImagePickerOptions = {
        maximumImagesCount: 5,
        width: 900,
        height: 900,
        quality: 50,
        outputType: 1
      }

      this.imagePicker.getPictures(options).then((results) => {
        for (var i = 0; i < results.length; i++) {
          let src = 'data:image/jpeg;base64,' + results[i];
          this.multiplePicsArr.push(src);

          let date = new Date();
          let timeStr = date.getTime();

          const fileTransfer: FileTransferObject = this.transfer.create();
          let uploadOptions: FileUploadOptions = {
            fileKey: 'file',
            fileName: timeStr + '_cause.jpg',
            headers: {}
          }

          // send file to server
          fileTransfer.upload(src, this.global.apiUrl('/uploadImage'), uploadOptions).then((data) => {
            let res = JSON.parse(data.response);
            // if success
            if(res.msg == "succes") {
              this.multiplePics.push(this.global.base_url('assets/images/'+ timeStr + '_cause.jpg'));
            }
            
          }).catch((err) => {
            // alert('Server is unable to upload your image please try again later.');
            this.global.dismissLoader();
          });
        }
      }, (err) => { });
    }
    else {
      alert("you can upload only upto 5 images or videos.");
    }

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

  // gotoCharityPage
  gotoCharityPage() {

    // goto charity page
    const modal = this.modalCtrl.create(CharitiesPage, {
      charities: this.all_charities,
      page: 'cause-form'
    });
    modal.present();

    modal.onDidDismiss((data) => {
      console.log('view dismiss run successfuly');

      // declare empty array for charity
      let charities = [];
      this.charities = [];
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
    });
  }

  // getCountries
  getCountries() {
    this.userService.getAllCountries().subscribe(data => {
      // GET COUNTRY DIAL CODE BY ITS CODE
      data.forEach(element => {
        if (element.id == this.country) {
          this.country = element.id;
        }
      });

      this.countries = data;
    }, err => {
      console.log(err);
    });
  }

  // getRegions
  getRegions() {
    this.userService.getAllRegions().subscribe(data => {
      // GET COUNTRY DIAL CODE BY ITS CODE
      data.forEach(element => {
        if (element.id == this.regionId) {
          this.regionId = element.id;
        }
      });
      this.all_regions = data;
    }, err => {
      console.log(err);
    });
  }
}
