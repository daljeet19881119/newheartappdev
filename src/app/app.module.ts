import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ProfilePage } from '../pages/profile/profile';
import { HttpModule } from '@angular/http';
import { VerifynumberPage } from '../pages/verifynumber/verifynumber';
import { WelcomePage } from '../pages/welcome/welcome';
import { VerifycodePage } from '../pages/verifycode/verifycode';
import { UserinfoPage } from '../pages/userinfo/userinfo';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ProfilePage,
    VerifynumberPage,
    WelcomePage,
    VerifycodePage,
    UserinfoPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ProfilePage,
    VerifynumberPage,
    WelcomePage,
    VerifycodePage,
    UserinfoPage
  ],
  providers: [
    StatusBar,
    SplashScreen,    
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
