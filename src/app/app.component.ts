import { Component, ViewChild } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { WelcomePage } from '../pages/welcome/welcome';
import { HomePage } from '../pages/home/home';
import { UserinfoPage } from '../pages/userinfo/userinfo';
import { CauseFormPage } from '../pages/cause-form/cause-form';
import { MerchantFormPage } from '../pages/merchant-form/merchant-form';
import { VolunteerFormPage } from '../pages/volunteer-form/volunteer-form';
import { UserProfilePage } from '../pages/user-profile/user-profile';
import { GlobalProvider } from '../providers/global/global';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  rootPage:any = WelcomePage;

  @ViewChild(Nav) nav: Nav;

  uuid: any = null;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private http: Http, private global: GlobalProvider) {
    platform.ready().then(() => {

      // call func getDeviceID
    //  this.getDeviceID();

      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  // getDeviceID
  getDeviceID() {
    this.uuid = this.global.uuid();

    // call requestData
    this.requestData();
  }

  // requestData
  requestData() {

    this.http.get('http://ionic.dsl.house/heartAppApi/get-verified-user.php?uuid='+this.uuid).map(res => res.json()).subscribe(data => {
      // console.log(data);

      if(data.data.verification =='notVerified' && data.data.profile_status=='notVerified') {
        this.rootPage = WelcomePage;
      }
      if(data.data.verification =='verified' && data.data.profile_status=='notVerified') {
        this.rootPage = UserinfoPage;
      }
      if(data.data.verification =='verified' && data.data.profile_status=='verified') 
      {
        this.rootPage = HomePage;
      }
     
      
      
    }, error => {
      console.log(error);
    });
  }

  // gotoCauseFormPage
  gotoCauseFormPage() {
    this.nav.push(CauseFormPage);
  }

  // gotoMerchantFormPage
  gotoMerchantFormPage() {
    this.nav.push(MerchantFormPage);
  }

  // gotoVolunteerFormPage
  gotoVolunteerFormPage() {
    this.nav.push(VolunteerFormPage);
  }

  // gotoUserProfile
  gotoUserProfile() {
    this.nav.push(UserProfilePage);
  }

}

