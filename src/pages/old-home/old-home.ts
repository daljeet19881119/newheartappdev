import { Component } from '@angular/core';
import { NavController, MenuController, NavParams, Platform, LoadingController, IonicPage } from 'ionic-angular';
import { ProfilePage } from '../profile/profile';
import { UserProvider } from '../../providers/user/user';
import { StreamingMedia, StreamingVideoOptions } from '@ionic-native/streaming-media';
import { HomePageProvider } from '../../providers/home-page/home-page';
import { SocialSharing } from '@ionic-native/social-sharing';
import { ViewChild } from '@angular/core';
import { Slides } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { GlobalProvider } from '../../providers/global/global';


@IonicPage()
@Component({
  selector: 'page-old-home',
  templateUrl: 'old-home.html',
})
export class OldHomePage {
  @ViewChild(Slides) slides: Slides;

  // icons
  latestTabs: string = 'donations';
  tabClass: string = 'tab-' + this.latestTabs;

  // latestDonations
  latestDonations: any;

  // latestPayments array
  latestPayments: any = [];
  heloWish: string;
  name: string = 'Loading...';
  uuid: any;
  showDonationBtn: boolean = true;
  showPaymentBtn: boolean = true;
  limit: number = 6;
  paging: number = 1;
  paymentPaging: number = 1;
  recommendedBigHearts: any;

  // user selected charities
  charities: any;
  charityAutoplay: number = 3000;
  charityLoop: boolean = true;
  loader: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public menuCtrl: MenuController, public platform: Platform, public userService: UserProvider, private global: GlobalProvider, private streamingMedia: StreamingMedia, private homeService: HomePageProvider, public loadingCtrl: LoadingController, private sharing: SocialSharing, private storage: Storage) {

    // call function to get device id
    this.getDeviceID();

    // request data from server
    this.homeService.getLatestDonations().subscribe(data => {

      // store requested data in the latestDonations
      this.latestDonations = data.res;

      let count = parseInt(data.count);
      let paging = Math.ceil(count / this.limit);

      // hide button if count is <= 5
      if (paging <= 1) {
        this.showDonationBtn = false;
      }

      // console.log(data);
    }, err => {
      console.log('Oops!');
    });

    // request data from server
    this.homeService.getLatestPayments().subscribe(data => {

      // store requested data in the latestPayments
      this.latestPayments = data.res;

      let count = parseInt(data.count);
      let paging = Math.ceil(count / this.limit);

      // hide button if count is <= 5
      if (paging <= 1) {
        this.showPaymentBtn = false;
      }
      // console.log(this.latestPayments);
    },
      err => {
        console.log('Oops!');
      });

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
    // call func getCharity
    // this.getCharity();

  }

  ionViewDidLoad() {
    // call func getDeviceID
    if(this.global.uuid()) {
      this.uuid = this.global.uuid();

      // get login user data
      this.userService.getUserByDeviceId(this.uuid).subscribe((data) => {
        this.name = data.data.fname;
      });
    }

    // get user causes from storage
    this.storage.get('user_causes').then(data => {
      this.charities = data;
    });
  }

  ionViewWillEnter() {
    console.log('home page loaded');
    // call function getRecommendedBigHearts
    this.getRecommendedBigHearts();
  }

  // showTabs
  showTabs() {
    console.log('you selected: ' + this.latestTabs);
  }

  // gotoProfilePage
  gotoProfilePage(id: number) {

    // send param and goto profile page
    this.navCtrl.push(ProfilePage, {
      id: id,
      uuid: this.uuid
    });
  }

  // viewAll
  viewAll() {

    this.createLoader();

    // increment paging
    this.paging++;

    // select the donation list
    // let donationList = document.getElementById('donation-list');
    let donationList = document.getElementsByClassName('donations-lists');
    let offset = donationList.length;

    // request data from server
    this.homeService.getLatestDonations(offset).subscribe(data => {

      this.loader.dismiss();

      // loop of data
      data.res.forEach(element => {

        // push data into latestDonations
        this.latestDonations.push(element);
      });

      let count = parseInt(data.count);
      let paging = Math.ceil(count / this.limit);

      // hide button if count is <= 5
      if (this.paging >= paging) {
        this.showDonationBtn = false;
      }

      console.log(data);
    }, err => {
      console.log('Oops!');
    });
  }

  // viewAllPayments
  viewAllPayments() {

    this.createLoader();

    // increment paging
    this.paymentPaging++;

    // select the donation list
    let paymentList = document.getElementsByClassName('payments-lists');
    let offset = paymentList.length;

    // request data from server
    this.homeService.getLatestPayments(offset).subscribe(data => {

      this.loader.dismiss();

      // loop of data
      data.res.forEach(element => {

        // push data into latestDonations
        this.latestPayments.push(element);
      });

      let count = parseInt(data.count);
      let paging = Math.ceil(count / this.limit);

      // hide button if count is <= 5
      if (this.paymentPaging >= paging) {
        this.showPaymentBtn = false;
      }

      console.log(data);
    }, err => {
      console.log('Oops!');
    });
  }

  // playVideo
  async playVideo() {
    let options: StreamingVideoOptions = {
      successCallback: () => { console.log('Video played') },
      errorCallback: (e) => { console.log('Error streaming') },
      orientation: 'portrait'
    };

    this.streamingMedia.playVideo(this.global.base_url('assets/videos/small.mp4'), options);
  }


  // getDeviceID
  getDeviceID() {
    if(this.global.uuid()) {
      this.uuid = this.global.uuid();
    }
    else{
      this.uuid = 'undefined';
    }
  }

  // getRecommendedBigHearts
  getRecommendedBigHearts() {

    // store uuid
    let uuid;
    uuid = this.uuid;
    if (this.uuid !== '') {
      uuid = this.navParams.get('uuid');
    }
    else {
      uuid = 'undefined';
    }

    // get all recommended bighearts
    this.homeService.getRecommendedBigHearts(uuid).subscribe(data => {

      // store data
      this.recommendedBigHearts = data;
      console.log(data);
    }, err => {
      console.log('Oops!');
    });
  }

  // getCharity
  getCharity() {

    // store uuid
    let uuid;
    uuid = this.uuid;
    if (this.uuid !== '') {
      uuid = this.navParams.get('uuid');
    }
    else {
      uuid = 'undefined';
    }

    // call func to get user charities
    this.userService.getUserByDeviceId(uuid).subscribe(data => {

      // store all user charities
      let charities = data.data.charity_type;

      // convert charities string to array
      this.charities = charities.split(',');

    }, err => {
      console.log('Oops!' + err);
    });
  }

  // createLoader
  createLoader() {
    this.loader = this.loadingCtrl.create({
      spinner: 'dots',
      content: 'Please wait...'
    });

    this.loader.present();
  }

  // shareInfo
  shareInfo(ngoName: string, ngoFounderImg: string, ngoFounderName: string, ngoFounderDesc: string, videoUrl: string = null) {

    let message = ngoFounderDesc;
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

}
