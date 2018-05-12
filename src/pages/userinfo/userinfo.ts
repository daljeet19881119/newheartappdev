import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ModalController, LoadingController } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { HomePage } from '../home/home';

/**
 * Generated class for the UserinfoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-userinfo',
  templateUrl: 'userinfo.html',
})
export class UserinfoPage {

  userType: string = 'shopper';
  charityType: string = 'health charities';
  gender: string = 'male';
  dob: string = null;
  name: string = null;
  email: string = null;
  mobileno: number;
  country: number;
  profileStatus: string = null;

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, private http: Http, private loadingCtrl: LoadingController, private modalCtrl: ModalController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserinfoPage');

    this.mobileno = this.navParams.get('mobileno');
    this.country = this.navParams.get('country');
  }

  // registerUser
  registerUser() {

    // check if all fields are not empty then register user
    if(this.dob ===null || this.name ===null || this.email ===null)
    {
        const alert = this.alertCtrl.create({
          title: 'Heart App',
          message: 'Please fill all fields',
          buttons: ['ok']
        });
        alert.present();
    }
    else{
      // make server request
      this.makeServerRequest();
    }
  }

  // makeServerRequest
  makeServerRequest() {
    this.http.get('http://ionic.dsl.house/heartAppApi/verify-users.php?profile_status=verified&user_type='+this.userType+'&name='+this.name+'&email='+this.email+'&gender='+this.gender+'&dob='+this.dob+'&charity_type='+this.charityType+'&c_code='+this.country+'&m_no='+this.mobileno).map(res => res.json()).subscribe(data => {
      this.profileStatus = data.data.profile_status;
      console.log(data);

      // check if profileStatus is null
      if(this.profileStatus !== null)
      {
        // gotodashboard
        const modal = this.modalCtrl.create(HomePage);
        modal.present();
      }
      else{
          const loader = this.loadingCtrl.create({
              content: "Please wait..."
          });
          loader.present();
      }

    }, error => {
      console.log('Oops!');
    });
  }
}
