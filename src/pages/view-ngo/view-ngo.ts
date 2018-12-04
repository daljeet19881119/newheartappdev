import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { GlobalProvider } from '../../providers/global/global';
import { HomePageProvider } from '../../providers/home-page/home-page';



@IonicPage()
@Component({
  selector: 'page-view-ngo',
  templateUrl: 'view-ngo.html',
})
export class ViewNgoPage {

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
  uuid: any;

  // loader
  loader: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, private global: GlobalProvider, private homeService: HomePageProvider, private loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');

    if (this.global.uuid()) {
      this.uuid = this.global.uuid();
    }
    else {
      this.uuid = 'undefined';
    }

    // get the ngoId from previous page
    let id = this.navParams.get('ngoid');

    this.homeService.getNgoById(id).subscribe(data => {
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
    }, err => {
      console.log(err);
    });
  }


  // getWords
  getWords() {
    // return only 5 words
    // return this.ngoDesc.split(/\s+/).slice(0,16).join(" ");

    // return only 30 character
    return this.ngoDesc.slice(0, 80);
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

  // createLoader
  createLoader() {
    this.loader = this.loadingCtrl.create({
      spinner: 'dots',
      content: 'Please wait...'
    });

    this.loader.present();
  }

}
