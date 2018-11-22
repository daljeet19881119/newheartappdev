import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { VerifynumberPage } from '../verifynumber/verifynumber';
import { UserProvider } from '../../providers/user/user';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { UniqueDeviceID } from '@ionic-native/unique-device-id';
import { UserinfoPage } from '../userinfo/userinfo';
import { HomePage } from '../home/home';
import { Storage } from '@ionic/storage';
import { BhHomePage } from '../bh-home/bh-home';

@IonicPage()
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html',
})
export class WelcomePage {

  uuid: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, private userService: UserProvider, private http: Http, private uniqueDeviceID: UniqueDeviceID, private storage: Storage) {   
    this.getDeviceID();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WelcomePage');
  }

  // gotoVerifyPage
  gotoVerifyPage() {
    setTimeout(() => {
      this.cleanStorage();
      this.navCtrl.setRoot(VerifynumberPage);
    }, 2000);      
  }

   // getDeviceID
   getDeviceID() {
    this.uniqueDeviceID.get()
      .then((uuid: any) => {
        this.uuid = uuid;  
        
        // call requestData
        this.requestData(this.uuid);
      })
      .catch((error: any) => {
        this.requestData('undefined');
        // this.gotoVerifyPage();
      });
  }

  // requestData
  requestData(uuid: any) {
    this.http.get('http://ionic.dsl.house/heartAppApi/get-verified-user.php?uuid='+uuid).map(res => res.json()).subscribe(data => {
      
      if(data.msg == 'success') 
      {
        if(data.data.verification =='notVerified' && data.data.profile_status=='notVerified') {
          this.gotoVerifyPage();
        }
        if(data.data.verification =='verified' && data.data.profile_status=='notVerified') {
          this.navCtrl.setRoot(UserinfoPage, {
            mobileno: data.data.mobileno,
            country: data.data.country
          }); 
        }
        if(data.data.verification =='verified' && data.data.profile_status=='verified') 
        {
          // store user charities in storage
          let charities = data.data.charity_type;
          
          // convert charities string to array
          charities = charities.split(',');

          // save all user charity or causes in storage
          this.storage.set('user_causes', charities);

          // check if user is bigheart or not
          if(data.data.is_bh_user == 'yes') {
            this.navCtrl.setRoot(BhHomePage);
          }
          else{
            this.navCtrl.setRoot(HomePage);
          } 
        } 
      }           
      if(data.msg == 'error') {
        this.gotoVerifyPage();
      }
    }, err => {
      this.gotoVerifyPage();
    });
  }
  
  // clean storage
  cleanStorage() {
    this.userService.cleanStorage();
  }
}
