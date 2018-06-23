import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { UserProvider } from '../../providers/user/user';
import { Storage } from '@ionic/storage';
import { UniqueDeviceID } from '@ionic-native/unique-device-id';
import { Camera, CameraOptions } from '@ionic-native/camera';

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
  charity: string;
  volunteerLocation: string;
  fewAboutYourself: string;
  moreAboutYourself: string;
  profilePic: any;

  contactName1: string;
  contactEmail1: string;
  contactDesc1: string;

  contactName2: string;
  contactEmail2: string;
  contactDesc2: string;

  contactName3: string;
  contactEmail3: string;
  contactDesc3: string;

  contactName4: string;
  contactEmail4: string;
  contactDesc4: string;

  contactName5: string;
  contactEmail5: string;
  contactDesc5: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private userService: UserProvider, private storage: Storage, public loadingCtrl: LoadingController, public alertCtrl: AlertController, private uniqueDeviceID: UniqueDeviceID, private camera: Camera) {
    
    // get countries from storage
    this.storage.get('countries').then((country) => {
        this.countries = country;
    }).catch((err) => {
      console.log('error: '+err);
    });
    
    // get volunteer form data from storage
    this.storage.get('volunteerForm').then((val) => {   
      
      this.fname = val.fname;
      this.lname = val.lname;
      this.email = val.email;
      this.charity = val.charity;
      this.volunteerLocation = val.volunteerLocation;
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
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VolunteerFormPage');

    
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

    let contact1 = this.contactName1+','+this.contactEmail1+','+this.contactDesc1;
    let contact2 = this.contactName2+','+this.contactEmail2+','+this.contactDesc2;
    let contact3 = this.contactName3+','+this.contactEmail3+','+this.contactDesc3;
    let contact4 = this.contactName4+','+this.contactEmail4+','+this.contactDesc4;
    let contact5 = this.contactName5+','+this.contactEmail5+','+this.contactDesc5;
    let userid = this.userid;

    if(this.fname != null && this.lname != null && this.email != null && this.charity != null && this.volunteerLocation != null && this.fewAboutYourself != null && this.moreAboutYourself != null)
    {
      this.createLoader();
          
      // request to server
      this.userService.saveVolunteerFormData(userid, this.fname, this.lname, this.email, this.charity, this.volunteerLocation, this.fewAboutYourself, this.moreAboutYourself, contact1, contact2, contact3, contact4, contact5).subscribe(data => {
        // alert(data.msg);
        this.setDataToStorage(userid, this.fname, this.lname, this.email, this.charity, this.volunteerLocation, this.fewAboutYourself, this.moreAboutYourself, contact1, contact2, contact3, contact4, contact5);

        this.loader.dismiss();
      }, err => {
        console.log('error: '+err);
        alert(err);
      });
    }
    else{
      this.createAlert();
    }
  }

  // createAlert
  createAlert() {
    const alert = this.alertCtrl.create({
          message: 'Please fill all fields.',
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
  setDataToStorage(userid: number, fname: string, lname: string, email: string, charity: string, volunteerLocation: string, fewAboutYourself: string, moreAboutYourself: string, contact1: string, contact2: string, contact3: string, contact4: string, contact5: string) {
    let data = {
        userid: userid,
        fname: fname,
        lname: lname,
        email: email,
        charity: charity,
        volunteerLocation: volunteerLocation,
        fewAboutYourself: fewAboutYourself,
        moreAboutYourself: moreAboutYourself,
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
    });
  }

  // take picture
  uploadPicture() {
    
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
    });
    
  }
}
