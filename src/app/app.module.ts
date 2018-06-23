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
import { HomePageProvider } from '../providers/home-page/home-page';
import { CommunityPage } from '../pages/community/community';
import { ContributorsPage } from '../pages/contributors/contributors';
import { TeamPage } from '../pages/team/team';
import { CauseFormPage } from '../pages/cause-form/cause-form';
import { MerchantFormPage } from '../pages/merchant-form/merchant-form';
import { VolunteerFormPage } from '../pages/volunteer-form/volunteer-form';
import { IonicStorageModule } from '@ionic/storage';
import { UserProfilePage } from '../pages/user-profile/user-profile';
import { SocialSharing } from '@ionic-native/social-sharing';
import { Camera } from '@ionic-native/camera';
import { FileTransfer } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';


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
    CharitiesPage,
    CommunityPage,
    ContributorsPage,
    TeamPage,
    CauseFormPage,
    MerchantFormPage,
    VolunteerFormPage,
    UserProfilePage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
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
    CharitiesPage,
    CommunityPage,
    ContributorsPage,
    TeamPage,
    CauseFormPage,
    MerchantFormPage,
    VolunteerFormPage,
    UserProfilePage
  ],
  providers: [
    StatusBar,
    SplashScreen, 
    UniqueDeviceID,
    ScreenOrientation,   
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    UserProvider,
    PhotoViewer,
    StreamingMedia,
    HomePageProvider  ,
    SocialSharing,
    Camera,
    File,
    FileTransfer      
  ]
})
export class AppModule {}
