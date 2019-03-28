import { Component } from '@angular/core';
import { NavController, MenuController, NavParams, Platform, ModalController } from 'ionic-angular';
import { ProfilePage } from '../profile/profile';
import { UserProvider } from '../../providers/user/user';
import { StreamingMedia, StreamingVideoOptions } from '@ionic-native/streaming-media';
import { HomePageProvider } from '../../providers/home-page/home-page';
import { SocialSharing } from '@ionic-native/social-sharing';
import { ViewChild } from '@angular/core';
import { Slides } from 'ionic-angular';
import { GlobalProvider } from '../../providers/global/global';
import { FCM } from '@ionic-native/fcm';
import { ThankyouVideoPage } from '../thankyou-video/thankyou-video';
import { UserBigheartsPage } from '../user-bighearts/user-bighearts';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild(Slides) slides: Slides;

  // icons
  latestTabs: string = 'donations';
  tabClass: string = 'tab-' + this.latestTabs;

  // latestDonations
  latestDonations: any;

  heloWish: string;
  name: string = 'Loading...';
  uuid: any;
  showDonationBtn: boolean;
  limit: number = 20;
  paging: number = 1;
  recommendedBigHearts: any;

  // user selected charities
  charities: any;
  charityAutoplay: number = 3000;
  charityLoop: boolean = true;
  user_id: any;
  hc_balance: any;
  us_balance: any;
  cc_number: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public menuCtrl: MenuController, public platform: Platform, public userService: UserProvider, private global: GlobalProvider, private streamingMedia: StreamingMedia, private homeService: HomePageProvider, private sharing: SocialSharing, private fcm: FCM, private modalCtrl: ModalController) {

    // date object to store heloWish
    let d = new Date();
    if (d.getHours() < 12) {
      this.heloWish = 'Good morning,';
    }
    if (d.getHours() >= 12 && d.getHours() < 17) {
      this.heloWish = 'Good afternoon,';
    }
    if (d.getHours() >= 17 && d.getHours() < 20) {
      this.heloWish = 'Good evening,';
    }
    if (d.getHours() >= 20 && d.getHours() < 6) {
      this.heloWish = 'Good night,';
    }

    // if user try to go back then exitapp
    this.platform.registerBackButtonAction(() => {
      platform.exitApp();
    });

  }

  ionViewDidLoad() {
    // check if uuid found
    if (this.global.uuid()) {
      this.uuid = this.global.uuid();
    }
    else {
      this.uuid = 'undefined';
    }

    // call firebaseNotification function
    this.firebaseNotification();
  }

  ionViewWillEnter() {
    // get login user data
    this.userService.getUserByDeviceId(this.uuid).subscribe((data) => {
      this.name = data.data.fname;
      this.us_balance = this.toLocaleString(parseFloat(data.data.us_balance).toFixed(2));
      this.hc_balance = this.toLocaleString(parseFloat(data.data.hc_balance).toFixed(2));
      this.user_id = data.data.user_id;
      this.cc_number = data.data.card_details.card_last_digit;

      // get user bighearts
      this.homeService.getUserDashboardData(this.user_id).subscribe(res => {

        if (res.msg == 'success') {
          // store requested data in the latestDonations
          this.latestDonations = res.data;

          let count = parseInt(res.count);
          let paging = Math.ceil(count / this.limit);

          // hide button if count is <= 5
          if (paging <= 1) {
            this.showDonationBtn = false;
          }
          else {
            this.showDonationBtn = true;
          }

          // store user charities
          this.charities = res.user_charities;

          // get recommend bigheart
          this.recommendedBigHearts = res.recommended_bh;
        }
      }, err => {
        console.log(err);
      });
    });
  }

  // showTabs
  showTabs() {
    console.log('you selected: ' + this.latestTabs);
  }

  // gotoProfilePage
  gotoProfilePage(id: number) {

    // send param and goto profile page
    this.navCtrl.push(ProfilePage, {
      bh_id: id,
      user_id: this.user_id,
      uuid: this.uuid
    });
  }

  // viewAll
  viewAll() {

    this.global.createLoader('Please wait...');

    // increment paging
    this.paging++;

    // select the donation list
    // let donationList = document.getElementById('donation-list');
    let donationList = document.getElementsByClassName('donations-lists');
    let offset = donationList.length;

    // get user bighearts
    this.homeService.getUserDashboardData(this.user_id, offset).subscribe(res => {
      this.global.dismissLoader();

      if (res.msg == 'success') {
        // loop of data
        res.data.forEach(element => {

          // push data into latestDonations
          this.latestDonations.push(element);
        });

        let count = parseInt(res.count);
        let paging = Math.ceil(count / this.limit);

        // hide button if count is <= 5
        if (this.paging >= paging) {
          this.showDonationBtn = false;
        }
        else {
          this.showDonationBtn = true;
        }
      }
    }, err => {
      this.global.dismissLoader();
      console.log(err);
    });
  }


  // playVideo
  async playVideo(video: any) {
    let options: StreamingVideoOptions = {
      successCallback: () => { console.log('Video played') },
      errorCallback: (e) => { console.log('Error streaming') },
      orientation: 'portrait'
    };

    this.streamingMedia.playVideo(video, options);
  }

  // playVideo
  playThankyouVideo(video: string) {
    const modal = this.modalCtrl.create(ThankyouVideoPage, {
      videoUrl: video
    });
    modal.present();
  }

  // shareInfo
  shareInfo(ngoName: string, ngoFounderImg: string, ngoFounderName: string, ngoFounderDesc: string, videoUrl: string = null) {

    let message = "I just donated from my HeartApp Link. \n"+ ngoFounderDesc;
    let subject = ngoFounderName + ' founder of ' + ngoName;
    let file = ngoFounderImg;
    let url;

    // check if videoUlr not empty
    if (videoUrl != null) {
      url = 'https://www.youtube.com/embed/' + videoUrl;
    }
    else {
      url = videoUrl;
    }

    this.sharing.share(message, subject, file, url).then(() => {
      console.log('shared successfully');
    }).catch((err) => {
      console.log(err);
    });
  }

  // toLocaleString
  toLocaleString(number: any) {
    return number.toLocaleString();
  }

  // firebaseNotification
  firebaseNotification() {
    this.fcm.onNotification().subscribe(data => {
      if (data.wasTapped) {
        // notification on background
        this.notificationAlert(data.title, data.body);
      }
      else {
        // notification on foreground
        this.notificationAlert(data.title, data.body);
      }
    });
  }

  // notificationAlert
  notificationAlert(title: string, msg: string) {
    this.global.createAlert(title, msg);
  }

  // getWords
  getWords(text: string) {
    // return only 5 words
    // return this.ngoDesc.split(/\s+/).slice(0,16).join(" ");
    
    // return only 30 character
    return text.slice(0, 20) + '.....';
  }

  // gotoUserBigheartsPage
  gotoUserBigheartsPage() {
    this.navCtrl.push(UserBigheartsPage);
  }
}
