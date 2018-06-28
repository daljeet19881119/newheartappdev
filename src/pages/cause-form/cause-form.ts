import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, ModalController, Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { UserProvider } from '../../providers/user/user';
import { UniqueDeviceID } from '@ionic-native/unique-device-id';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { CharitiesPage } from '../charities/charities';
import { HomePage } from '../home/home';

/**
 * Generated class for the CauseFormPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-cause-form',
  templateUrl: 'cause-form.html',
})
export class CauseFormPage {

  countries: any;
  fname: string;
  lname: string;
  country: string = 'US';
  city: string;
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

  loader: any;
  userid: any;
  uuid: any;
  profilePic: any;
  multiplePics: any;

  // variable to store charities
  charities: any = [];
  checkCharity: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage, private userService: UserProvider, public loadingCtrl: LoadingController, public alertCtrl: AlertController, private uniqueDeviceID: UniqueDeviceID, private camera: Camera,private transfer: FileTransfer, public modalCtrl: ModalController, private platform: Platform) {

    // store all countries
    this.storage.get('countries').then((val) => {
        this.countries = val;
    });

    // get data from storage
    this.storage.get('causeForm').then((val) => {
      this.fname = val.fname;
      this.lname = val.lname;
      this.email = val.email;
      this.charities = val.causeCat;
      this.checkCharity = true;
      this.country = val.country;
      this.city = val.city;
      this.fewAboutYourself = val.fewAboutYourself;
      this.moreAboutYourself = val.moreAboutYourself;

      if(val.contact1 != '')
      {
        // convert string into an array
        let contact1 = val.contact1.split(",");
        this.contactName1 = contact1[0];
        this.contactEmail1 = contact1[1];
        this.contactDesc1 = contact1[2];
      }
      
      if(val.contact2 != '')
      {
        let contact2 = val.contact2.split(",");
        this.contactName2 = contact2[0];
        this.contactEmail2 = contact2[1];
        this.contactDesc2 = contact2[2];
      }
      
      if(val.contact3 != '')
      {
        let contact3 = val.contact3.split(",");
        this.contactName3 = contact3[0];
        this.contactEmail3 = contact3[1];
        this.contactDesc3 = contact3[2];
      }

      if(val.contact4 != '')
      {
        let contact4 = val.contact4.split(",");
        this.contactName4 = contact4[0];
        this.contactEmail4 = contact4[1];
        this.contactDesc4 = contact4[2];
      }

      if(val.contact5 != '')
      {
        let contact5 = val.contact5.split(",");
        this.contactName5 = contact5[0];
        this.contactEmail5 = contact5[1];
        this.contactDesc5 = contact5[2];
      }      

    }).catch((err) => {
      console.log(err);
    });

    // get device id
    this.getDeviceID();

    // if user try goback then go to homepage
    this.platform.registerBackButtonAction(() => {
      this.navCtrl.push(HomePage);
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CauseFormPage');

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

    this.fname = this.navParams.get('fname');
    this.lname = this.navParams.get('lname');
    this.email = this.navParams.get('email');
  }

  // getDeviceID
  getDeviceID() {
    this.uniqueDeviceID.get()
      .then((uuid: any) => {
        this.uuid = uuid;  

        // request to userProvide
          this.userService.getUserByDeviceId(this.uuid).subscribe(data => {
            this.userid = data.data.id;
        }, err => {
          console.log(err);
        });
      })
      .catch((error: any) => {
        this.uuid = 'undefined';
      });
  }

  // saveData
  saveData() {

    // declare empty array for charity
    let charities = [];

    // loop of selected charity
    this.charities.forEach(element => {

      // remove starting space from each element and push into charity array
      charities.push(element.replace('  ',''));
    }); 

    let contact1 = this.contactName1+','+this.contactEmail1+','+this.contactDesc1;
    let contact2 = this.contactName2+','+this.contactEmail2+','+this.contactDesc2;
    let contact3 = this.contactName3+','+this.contactEmail3+','+this.contactDesc3;
    let contact4 = this.contactName4+','+this.contactEmail4+','+this.contactDesc4;
    let contact5 = this.contactName5+','+this.contactEmail5+','+this.contactDesc5;
    let userid = this.userid;

    if(this.fname != null && this.lname != null && this.country != null && this.city != null)
    {
         
        // check if valid mail
        if(this.validateEmail(this.email)==true)
        {
          // call func createLoader
          this.createLoader();

          // request user provider
          this.userService.saveCauseFormData(userid, this.fname, this.lname, this.email, charities, this.country, this.city, this.fewAboutYourself, this.moreAboutYourself, contact1, contact2, contact3, contact4, contact5).subscribe(data => {
            
            if(data.msg == 'success')
            {
              this.setDataToStorage(userid, this.fname, this.lname, this.email, charities, this.country, this.city, this.fewAboutYourself, this.moreAboutYourself, contact1, contact2, contact3, contact4, contact5);
              this.loader.dismiss();
            }
            if(data.msg == 'err')
            {
              this.loader.dismiss();
            }
          }, err => {
            console.log('error: '+err);
          });
        }
        else{
          alert("please enter valid email");
        }
    }
    else{
      this.createAlert();
    }
  }

  // createLoader
  createLoader() {
    this.loader = this.loadingCtrl.create({
      spinner: 'dots',
      content: 'Please wait...'
    });

    this.loader.present();
  }

  // createAlert
  createAlert() {
    const alert = this.alertCtrl.create({
          message: 'Please fill out the required fields.',
          buttons: ['ok']
    });

    alert.present();
  }

  // setDataToStorage
  setDataToStorage(userid: number, fname: string, lname: string, email: string, charities: any, country: string, city: string, fewAboutYourself: string, moreAboutYourself: string, contact1: string = '', contact2: string = '', contact3: string = '', contact4: string = '', contact5: string = '') {
    let data = {
        userid: userid,
        fname: fname,
        lname: lname,
        email: email,
        causeCat: charities,
        country: country,
        city: city,
        fewAboutYourself: fewAboutYourself,
        moreAboutYourself: moreAboutYourself,
        contact1: contact1,
        contact2: contact2,
        contact3: contact3,
        contact4: contact4,
        contact5: contact5
    };

    this.storage.set('causeForm', data);
  }

   // take picture
   tackPicture() {
    
    this.createLoader();

    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }
    
    this.camera.getPicture(options).then((imageData) => {
     // imageData is either a base64 encoded string or a file URI
     // If it's base64:
     let base64Image = 'data:image/jpeg;base64,' + imageData;
     this.profilePic = base64Image;
     this.loader.dismiss();
    }, (err) => {
     // Handle error
     console.log(err);
     this.loader.dismiss();
    });
  }

  // take picture
  choosePicture() {
    
    this.createLoader();

    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      saveToPhotoAlbum: false
    }
    
    this.camera.getPicture(options).then((imageData) => {
     // imageData is either a base64 encoded string or a file URI
     // If it's base64:
     let base64Image = 'data:image/jpeg;base64,' + imageData;
     this.profilePic = base64Image;
     this.loader.dismiss();
    }, (err) => {
     // Handle error
     console.log(err);
     this.loader.dismiss();
    });
    
  }

  // chooseMultiplePicture
  chooseMultiplePicture() {
      this.createLoader();

      const options: CameraOptions = {
        quality: 100,
        destinationType: this.camera.DestinationType.DATA_URL,
        sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
        saveToPhotoAlbum: false
      }
      
      this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      let base64Image = 'data:image/jpeg;base64,' + imageData;
      this.multiplePics = base64Image;
      this.loader.dismiss();
      }, (err) => {
      // Handle error
      console.log(err);
      this.loader.dismiss();
      });
  }

  // uploadPicture
  uploadPicture() {
    this.createLoader();
    const fileTransfer: FileTransferObject = this.transfer.create();

    let options: FileUploadOptions = {
        fileKey: 'file',
        fileName: 'volunteer.jpg',
        chunkedMode: false,
        httpMethod: 'post',
        mimeType: "image/jpeg",
        headers: {}
    }
 
   fileTransfer.upload(this.profilePic, 'http://ionic.dsl.house/heartAppApi/image-upload.php', options)
      .then((data) => {
        // success
        this.loader.dismiss();
      }, (err) => {
        // error
        this.loader.dismiss();
      });
  }

  // validateEmail
  validateEmail(mail: string) 
  {
      if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail))
      {
        return true;
      }
      else
      {
        return false;
      }     
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
                          page: 'cause-form',
                          fname: this.fname,
                          lname: this.lname,
                          email: this.email
                  });
                  modal.present();
  }
}
