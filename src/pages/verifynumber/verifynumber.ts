import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ModalController, LoadingController } from 'ionic-angular';
import { VerifycodePage } from '../verifycode/verifycode';
import { Http } from '@angular/http';

/**
 * Generated class for the VerifynumberPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-verifynumber',
  templateUrl: 'verifynumber.html',
})
export class VerifynumberPage {

  // country
  country: number = 91;
  mobileno: number = null;
  verficationCode: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController, private http: Http, private modalCtrl: ModalController, public loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VerifynumberPage');

    // create alert on page load
    const alert = this.alertCtrl.create({
      title: 'Heart App',
      message: 'Please select country and enter phone number to get verification code.',
      buttons: ['ok']
    });
    alert.present();
  }

  // validateNumber
  validateNumber() {
    
    // check if country or number is empty give alert
    if(this.mobileno === null)
    {
      // create alert
      let errAlert = this.alertCtrl.create({
        message: 'please enter your number',
        buttons: ['ok']
      });
      errAlert.present();
    }
    else
    {
      // sendSMS
      this.sendSMS();
    }
  }

  
  // sendSMS
  sendSMS() {
    // request data from server
    this.http.get('http://ionic.dsl.house/heartAppApi/verify-users.php?country='+this.country+'&mobileno='+this.mobileno).map(res => res.json()).subscribe(data => {
      this.verficationCode = data.data.verification_code;
      console.log(data);

      // check if verification code is null then show loader
      if(this.verficationCode !== null) 
      {

        // push to verifycode page
        const modal = this.modalCtrl.create(VerifycodePage,{
          phone: this.mobileno,
          country: this.country,
          code: this.verficationCode
        });
        modal.present();
        
      }
      else
      {
          let loader = this.loadingCtrl.create({
            content: "Please wait..."
          });
        loader.present();
      } 
    }, err => {
      console.log('Oops!');
    });
  }

}
