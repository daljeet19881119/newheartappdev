import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { YtvideoPage } from '../ytvideo/ytvideo';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { DomSanitizer } from '@angular/platform-browser';

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

  constructor(public navCtrl: NavController, public navParams: NavParams, private http: Http, private modalCtrl: ModalController, private screenOrientation: ScreenOrientation, private photoViewer: PhotoViewer, private dom: DomSanitizer) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');

    // get the ngoId from previous page
    let id = this.navParams.get('id');

    // request data from server
    this.http.get('http://ionic.dsl.house/heartAppApi/new-ngo-profile.php?id='+id).map(res => res.json()).subscribe(data => {
      
      // store data in the ngoData
      this.ngoFounderImg = data.ngo_founder_img;
      this.ngoFounderName = data.ngo_founder;
      this.ngoName = data.ngo_name;
      this.ngoCampaigns = data.campaigns;
      this.ngoCommunity = data.community;
      this.ngoContributors = data.contributors;
      this.ngoTeam = data.team;
      this.ngoYoutubeId = data.youtube_id;
      this.ngoDesc = data.ngo_desc;
      this.ngoFamilyImgs = data.ngo_family_img;
      this.ngoFamilyFirstImg = data.ngo_family_img[0];
      console.log(data);
    }, err => {
      console.log('Oops!');
    });

    
  }

  // getYoutubeVideoImgUrl
  getYoutubeVideoImgUrl() {

    let url;

    // check youtube video url is not empty
    if(this.ngoYoutubeId === ''){
      url = this.ngoFamilyFirstImg;
    }
    else{
      url = 'https://img.youtube.com/vi/'+ this.ngoYoutubeId +'/hqdefault.jpg';
    }

    return url;
  }

  // showFullVideo
  showFullVideo() {

     // detect orientation changes
     this.screenOrientation.onChange().subscribe(
      () => {
          // alert("Orientation Changed to : "+this.screenOrientation.type);

          // check if screen is in landscape
          if(this.screenOrientation.ORIENTATIONS.LANDSCAPE)
          {
             // store youtube video url
            let videoUrl = this.youtubeUrl + this.ngoYoutubeId;
            let viewModal = this.modalCtrl.create(YtvideoPage, {videoUrl: videoUrl});
            viewModal.present();
          }
      }
    );   
  }

  // getWords
  getWords() {
    // return only 5 words
    // return this.ngoDesc.split(/\s+/).slice(0,16).join(" ");

    // return only 30 character
    return this.ngoDesc.slice(0,80);
  }

  // show all words
  showAllWords() {
    document.getElementById('ngo-desc').innerHTML = this.ngoDesc;  
    this.showMore = false;  
  }

    // showLessWords
  showLessWords() {
    document.getElementById('ngo-desc').innerHTML = this.ngoDesc.slice(0,80)+'.....';
    this.showMore = true; 
  } 

  // showWords
  showWords() {
    this.showMore = !this.showMore;

    // check if showmore is true
    if(this.showMore === true) {
      this.showLessWords();
    }else{
      this.showAllWords();
    }
  }

  // showFullImg
  showFullImg(event) {
    // get current image url and replace url(" ") from url("imageurl")
    let url = event.srcElement.style.backgroundImage.split('("')[1]
    .split('")')[0];;

    this.photoViewer.show(url, '', {share: false});
  }

  // getIframeUrl
  getIframeUrl() {
    let controlls = '?theme=dark&autohide=2&modestbranding=1&showinfo=0';
    return this.dom.bypassSecurityTrustResourceUrl(this.youtubeUrl+this.ngoYoutubeId+controlls);
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
  }
}
