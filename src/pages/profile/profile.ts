import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

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

  constructor(public navCtrl: NavController, public navParams: NavParams, private http: Http) {
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
      console.log(data);
    }, err => {
      console.log('Oops!');
    });
  }

}
