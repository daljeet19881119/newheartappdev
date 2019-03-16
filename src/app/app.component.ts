import { Component, ViewChild } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { WelcomePage } from '../pages/welcome/welcome';
import { CauseFormPage } from '../pages/cause-form/cause-form';
import { MerchantFormPage } from '../pages/merchant-form/merchant-form';
import { VolunteerFormPage } from '../pages/volunteer-form/volunteer-form';
import { UserProfilePage } from '../pages/user-profile/user-profile';
import { SettingsPage } from '../pages/settings/settings';
import { SigninPage } from '../pages/signin/signin';
import { UserProvider } from '../providers/user/user';
import { GlobalProvider } from '../providers/global/global';
import { InAppBrowser } from '@ionic-native/in-app-browser';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  rootPage:any = WelcomePage;

  @ViewChild(Nav) nav: Nav;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private userService: UserProvider, private global: GlobalProvider, private iab: InAppBrowser) {
    platform.ready().then(() => {      
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
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

  // gotoSettingsPage
  gotoSettingsPage() {
    this.nav.push(SettingsPage);
  }

  // logout
  logout() {
    this.global.createLoader();
    const uuid = this.global.uuid();
    this.userService.logout(uuid).subscribe(data => {
      if(data.msg == 'success') {
        this.nav.setRoot(SigninPage);
      }      
      this.global.dismissLoader();
    });    
  }

  // privacyPolicy
  privacyPolicy() {
    const url = 'http://heartglobal.world/home-3/terms/';

    // open web view
    const browser = this.iab.create(url);
    browser.show();
  }
}

