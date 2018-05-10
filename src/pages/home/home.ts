import { Component } from '@angular/core';
import { NavController, MenuController, NavParams } from 'ionic-angular';
import { ProfilePage } from '../profile/profile';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  // icons
  icons: string = 'donations';

  // latestDonations
  latestDonations: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public menuCtrl: MenuController, private http: Http) {

    // request data from server
    this.http.get('http://ionic.dsl.house/heartAppApi/new-latest-donations.php').map(res => res.json()).subscribe(data => {
      
      // store requested data in the latestDonations
      this.latestDonations = data;
      // console.log(data);
    }, err => {
      console.log('Oops!');
    });
  }

  // showTabs
  showTabs() {
    console.log('you selected: '+this.icons);
  }

  // gotoProfilePage
  gotoProfilePage(id: number) {

    // send param and goto profile page
    this.navCtrl.push(ProfilePage, {
      id: id
    });
  }
}
