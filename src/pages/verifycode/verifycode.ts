import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController, Platform, LoadingController } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { UserinfoPage } from '../userinfo/userinfo';
import { HomePage } from '../home/home';
import { UniqueDeviceID } from '@ionic-native/unique-device-id';

/**
 * Generated class for the VerifycodePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

 
@IonicPage()
@Component({
  selector: 'page-verifycode',
  templateUrl: 'verifycode.html',
})
export class VerifycodePage {

  // mobileno
  mobileno: number;
  country: number;
  code: number;
  verifyCode: number;
  uuid: any;
  btnDisable: boolean = true;
  loader: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private http: Http, private modalCtrl: ModalController, private alertCtrl: AlertController, public platform: Platform, private uniqueDeviceID: UniqueDeviceID, public loadingCtrl: LoadingController) {

    // if user try goback then exit app
    this.platform.registerBackButtonAction(() => {
      platform.exitApp();
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VerifycodePage');

    // store phoneno
    this.mobileno = this.navParams.get('phone');
    this.country = this.navParams.get('country');
    this.verifyCode = this.navParams.get('code');
  }

  // checkCode
  checkCode(code: number) {
    // console.log('verify code is: '+code);
    
    // check if code matched to verification code then enable next button
    if(code.toString().length >= 4)
    {
      this.btnDisable = false;
    }
    else{
      this.btnDisable = true;
    }
  }

  // checkVerifyCode
  checkVerifyCode(code: number) {

      // call createLoader
      this.createLoader();

      // check if code matched to verifyCode
      if(code == this.verifyCode)
      {
        // verify user
        this.verifyUser(code);

        let page: any;
        // check if userExists
        if(this.navParams.get('userExists') == 'true')
        {
          page = HomePage;
        }else{
          page = UserinfoPage;
        }

        // gotoUserinfoPage
        const modal = this.modalCtrl.create(page, {
                  mobileno: this.mobileno,
                  country: this.country                      
              });
        modal.present();

        this.loader.dismiss();
      }
      else
      {
        // show alert
        const alert = this.alertCtrl.create({
          title: 'Heart App',
          message: 'Your verification code does not matched.',
          buttons: ['ok']
        });
        alert.present();

        this.loader.dismiss();
        console.log('Oops code not matched!');
      }
  }

  // verifyUser
  verifyUser(verifyCode: any) {
      // server request
      this.http.get('http://ionic.dsl.house/heartAppApi/verify-users.php?verify=verified&phoneno='+this.mobileno+'&country_code='+this.country+'&verify_code='+verifyCode).map(res => res.json()).subscribe(data => {
        console.log(data);
      }, err => {
        console.log('Oops!'+err);
      });
  }

  // resendVerifcationCode
  resendVerificationCode() {
    // console.log('resend verification code');
    
    // call createLader
    this.createLoader();

     // request data from server
     this.http.get('http://ionic.dsl.house/heartAppApi/verify-users.php?country='+this.country+'&mobileno='+this.mobileno+'&uuid='+this.uuid).map(res => res.json()).subscribe(data => {
       
        this.verifyCode = data.data.verification_code;
        console.log(data);

        this.loader.dismiss();
    }, err => {
      console.log(err);
    });
  }

  // getuniqueDeviceID
  getuniqueDeviceID() {
    this.uniqueDeviceID.get()
      .then((uuid: any) => {this.uuid = uuid;})
      .catch((error: any) => console.log(error));
  }

  // createLoader
  createLoader() {
    this.loader = this.loadingCtrl.create({
      spinner: 'dots',
      content: 'Please wait...'
    });

    this.loader.present();
  }
}
