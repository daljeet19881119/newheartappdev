import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { YtvideoPage } from '../ytvideo/ytvideo';
// import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { DomSanitizer } from '@angular/platform-browser';
import { CampaignsPage } from '../campaigns/campaigns';
import { UserProvider } from '../../providers/user/user';
import { CommunityPage } from '../community/community';
import { TeamPage } from '../team/team';
import { ContributorsPage } from '../contributors/contributors';
import { GlobalProvider } from '../../providers/global/global';
import { UserBigheartsPage } from '../user-bighearts/user-bighearts';
import { HomePageProvider } from '../../providers/home-page/home-page';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  // ngoData
  ngoFounderImg: string = 'assets/imgs/background.png';
  ngoFounderName: string = 'Loading...';
  ngoName: string = 'Loading...';
  bhNonProfit: string = '';
  ngoCampaigns: string = 'Loading...';
  ngoCommunity: string = 'Loading...';
  ngoContributors: string = 'Loading...';
  ngoTeam: string = 'Loading...';
  youtubeUrl: string = 'https://www.youtube.com/embed/';
  ngoYoutubeId: string = '';
  ngoDesc: string = 'Loading...';
  ngoFamilyImgs: string;
  ngoFamilyFirstImg: string = '';
  showMore: boolean = true;
  showIframe: boolean = false;
  showIframediv: boolean;

  // addBigHearts class added-bighearts
  addBigHeartsClass: string = 'add-to-bighearts';
  addBigHeartText: string = 'Add to my BigHearts';
  uuid: any;

  showItem: boolean = true;
  user_id: any;
  bh_id: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private modalCtrl: ModalController,private photoViewer: PhotoViewer, private dom: DomSanitizer, private userProvider: UserProvider, private global: GlobalProvider, private homeService: HomePageProvider) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');

    if (this.global.uuid()) {
      this.uuid = this.global.uuid();
    }
    else {
      this.uuid = 'undefined';
    }

    // check if nav param page == register page
    if(this.navParams.get('page') && this.navParams.get('page') == 'register'){
      this.showItem = false;
    } 

    // get the ngoId from previous page
    this.bh_id = this.navParams.get('bh_id'); 

    // check if user id comming in nav params
    if(this.navParams.get('user_id') && this.navParams.get('bh_id')) {
       // get user id from nav params
      this.user_id = this.navParams.get('user_id');
      // call function
      this.checkInUserBigHearts(this.user_id, this.bh_id);
    }
          

    this.homeService.getBHById(this.bh_id).subscribe(data => {
      // store data in the ngoData
      this.ngoFounderImg = data.bh_founder_img;
      this.ngoFounderName = data.bh_founder_name;
      this.ngoName = data.bh_name;

      // check if non profit main not emtpy
      if(data.bh_associated_non_profit != '') {
        this.bhNonProfit = data.bh_associated_non_profit;
      }
      else{
        this.bhNonProfit = data.bh_name;
      }

      this.ngoCampaigns = data.bh_compaigns;
      this.ngoTeam = data.bh_team;
      this.ngoYoutubeId = data.bh_youtube_id;
      this.ngoDesc = data.bh_desc;
      this.ngoFamilyImgs = data.bh_family_img;
      this.ngoFamilyFirstImg = data.bh_family_img[0];

      // check if youtube id not empty
      if (this.ngoYoutubeId !== '') {
        this.showIframediv = true;

        // hide youtube image div
        document.getElementById('iframe-div').style.display = 'none';
      }
    }, err => {
      console.log(err);
    });
    
  }

  // getYoutubeVideoImgUrl
  getYoutubeVideoImgUrl() {

    let url;

    // check youtube video url is not empty
    if (this.ngoYoutubeId === '') {
      url = this.ngoFamilyFirstImg;
    }
    else {
      url = 'https://img.youtube.com/vi/' + this.ngoYoutubeId + '/hqdefault.jpg';
    }

    return url;
  }

  // showFullVideo
  showFullVideo() {
     // store youtube video url
     let videoUrl = this.youtubeUrl + this.ngoYoutubeId;
     let viewModal = this.modalCtrl.create(YtvideoPage, { videoUrl: videoUrl });
     viewModal.present();    
  }

  // getWords
  getWords() {
    // return only 5 words
    // return this.ngoDesc.split(/\s+/).slice(0,16).join(" ");

    // return only 30 character
    return this.ngoDesc.slice(0, 80) + '.....';
  }

  // show all words
  showAllWords() {
    document.getElementById('ngo-desc').innerHTML = this.ngoDesc;
    this.showMore = false;
  }

  // showLessWords
  showLessWords() {
    document.getElementById('ngo-desc').innerHTML = this.ngoDesc.slice(0, 80) + '.....';
    this.showMore = true;
  }

  // showWords
  showWords() {
    this.showMore = !this.showMore;

    // check if showmore is true
    if (this.showMore === true) {
      this.showLessWords();
    } else {
      this.showAllWords();
    }
  }

  // showFullImg
  showFullImg(event) {
    // get current image url and replace url(" ") from url("imageurl")
    let url = event.srcElement.style.backgroundImage.split('("')[1]
      .split('")')[0];

    // show image in viewer
    this.photoViewer.show(url, '', { share: false });
  }

  // getIframeUrl
  getIframeUrl() {
    let controlls = '?theme=dark&autohide=2&modestbranding=1&showinfo=0';
    return this.dom.bypassSecurityTrustResourceUrl(this.youtubeUrl + this.ngoYoutubeId + controlls);
  }

  // interchangeImg
  interchangeImg(event) {

    // select youtube div
    let youtube = document.getElementById('iframe-div');

    // get current small img url
    let imgurl = event.srcElement.style['background-image'];

    // get image of youtube video block
    let youtubeImgUrl = youtube.style.backgroundImage;

    // set small in video image block
    youtube.style.backgroundImage = imgurl;

    // set youtube image into small block
    event.srcElement.style.backgroundImage = youtubeImgUrl;

    // search only if this.ngoYoutubeId is not empty
    if (this.ngoYoutubeId !== '') {
      // serach youtube id from url
      let strSearch = imgurl.search(this.ngoYoutubeId);

      // check if youtube id not found
      if (strSearch === -1) {
        // set iframe value to flase
        this.showIframe = false;

        // hide youtube iframe div
        this.showIframediv = false;

        // show youtube image div
        youtube.style.display = 'block';

      }
      else {
        // show youtube iframe div
        this.showIframediv = true;

        // hide youtube image div
        youtube.style.display = 'none';
      }

      // search youtube id from big image url
      let idSearch = youtubeImgUrl.search(this.ngoYoutubeId);

      // store id of current clicked img
      let currentId = event.srcElement.getAttribute('id');

      // get the current clicked image previous element
      let youtubeBtn = document.getElementById(currentId).previousElementSibling;

      // check if youtube id found
      if (idSearch !== -1) {
        // show the youtube btn on video image  
        youtubeBtn.setAttribute('data-show-img', 'show');
      }
      else {

        // hide youtubebtn for non youtube image
        youtubeBtn.setAttribute('data-show-img', 'hide');
      }

    }

  }

  // changeImage
  changeImage(event) {
    // get current element id
    let btnId = event.srcElement.getAttribute('id');

    // get next element id
    let nextElmId = document.getElementById(btnId).nextElementSibling.getAttribute('id');

    // trigger click on next element
    document.getElementById(nextElmId).click();
  }

  // gotoCampignsPage
  gotoCampignPage() {
    this.navCtrl.push(CampaignsPage, { founderName: this.ngoFounderName });
  }

  // gotoCommunityPage
  gotoCommunityPage() {
    this.navCtrl.push(CommunityPage, { founderName: this.ngoFounderName });
  }

  // gotoContributorPage
  gotoContributorPage() {
    this.navCtrl.push(ContributorsPage, { founderName: this.ngoFounderName });
  }

  // gotoTeamPage
  gotoTeamPage() {
    this.navCtrl.push(TeamPage, { founderName: this.ngoFounderName });
  }
  // add ngo's to user list
  addToUserBigHearts() {

    // call func createLoader
    this.global.createLoader('Please wait...');

    // store ngoid
    let bh_id = this.navParams.get('bh_id');

    // store uuid
    let uuid;
	
	// store user_id
	let user_id = this.navParams.get('user_id');

    if (this.uuid !== '') {
      uuid = this.navParams.get('uuid');
    } else {
      uuid = 'undefined';
    }

    const data = {
      uuid: uuid,
      bh_id: bh_id,
	  user_id: user_id
    };

    // save ngo_id to users list
    this.userProvider.addToMyBigHearts(data).subscribe(data => {

      // dismiss the loader
      this.global.dismissLoader();

      // check if found true
      if (data.found == 'true') {
        // store added class to btn
        this.addBigHeartsClass = 'added-bighearts';
        this.addBigHeartText = 'Unselect from My BigHearts';
      }
    }, err => {
      // dismiss the loader
      this.global.dismissLoader();
    });

  }

  // check ngo's in the user list
  checkInUserBigHearts(user_id: any, bh_id: any) {
    // call loader function
    this.global.createLoader('Please wait...');

    // request data from server
    this.userProvider.checkInUserBigHearts(user_id, bh_id).subscribe(data => {

      // check if found true
      if (data.found == 'true') {
        // store added class to btn
        this.addBigHeartsClass = 'added-bighearts';
        this.addBigHeartText = 'Unselect from My BigHearts';
      }
      this.global.dismissLoader();
    }, err => {
      console.log('Oops!');
      this.global.dismissLoader();
    });
  }

  // remove ngo from user list
  removeFromUserBigHearts() {

    // call func createLoader
    this.global.createLoader('Please wait...');

    // store ngoid
    let bh_id = this.navParams.get('bh_id');

    // store uuid
    let uuid;
	
	// store user_id
	let user_id = this.navParams.get('user_id');

    if (this.uuid !== '') {
      uuid = this.navParams.get('uuid');
    } else {
      uuid = 'undefined';
    }

    const data = {
      uuid: uuid,
      bh_id: bh_id,
	  user_id: user_id
    };

    // request to server
    this.userProvider.removeFromMyBigHearts(data).subscribe(data => {

      // dismiss the loader
      this.global.dismissLoader();

      // check if found true
      if (data.found == 'true') {
        // store added class to btn
        this.addBigHeartsClass = 'add-to-bighearts';
        this.addBigHeartText = 'Add to my BigHearts';
		
		// redirect to all my bighearts page 
		this.navCtrl.push(UserBigheartsPage);
		
      }
    }, err => {
      // dismiss the loader
      this.global.dismissLoader();
    });
  }

  // gotoUserBigheartsPage
  gotoUserBigheartsPage() {
    this.navCtrl.push(UserBigheartsPage);
  }
}
