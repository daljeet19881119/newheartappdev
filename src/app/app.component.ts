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


@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  rootPage:any = WelcomePage;

  @ViewChild(Nav) nav: Nav;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
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
}

