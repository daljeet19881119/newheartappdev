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
import { UniqueDeviceID } from '@ionic-native/unique-device-id';
import { YtvideoPage } from '../pages/ytvideo/ytvideo';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { UserProvider } from '../providers/user/user';
import { HttpClientModule } from '@angular/common/http';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { CampaignsPage } from '../pages/campaigns/campaigns';
import { StreamingMedia } from '@ionic-native/streaming-media';
import { CharitiesPage } from '../pages/charities/charities';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ProfilePage,
    VerifynumberPage,
    WelcomePage,
    VerifycodePage,
    UserinfoPage,
    YtvideoPage,
    CampaignsPage,
    CharitiesPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule,
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
    UserinfoPage,
    YtvideoPage,
    CampaignsPage,
    CharitiesPage
  ],
  providers: [
    StatusBar,
    SplashScreen, 
    UniqueDeviceID,
    ScreenOrientation,   
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    UserProvider,
    PhotoViewer,
    StreamingMedia    
  ]
})
export class AppModule {}
