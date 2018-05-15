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
  latestTabs: string = 'donations';

  // latestDonations
  latestDonations: any;

  // latestPayments array
  latestPayments: any;
  heloWish: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public menuCtrl: MenuController, private http: Http) {

    // request data from server
    this.http.get('http://ionic.dsl.house/heartAppApi/new-latest-donations.php').map(res => res.json()).subscribe(data => {
      
      // store requested data in the latestDonations
      this.latestDonations = data;
      // console.log(data);
    }, err => {
      console.log('Oops!');
    });

    // request data from server
    this.http.get("http://ionic.dsl.house/heartAppApi/new-latest-payments.php").map(res => res.json()).subscribe(data => {
      this.latestPayments = data;
      // console.log(this.latestPayments);
      },
      err => {
      console.log('Oops!');
      });

      // date object to store heloWish
      let d = new Date();
      if(d.getHours() < 12){
       this.heloWish = 'Good morning';
      }
      if(d.getHours() >= 12 && d.getHours() < 17){
        this.heloWish = 'Good afternoon';
      }
      if(d.getHours() >= 17 && d.getHours() < 20){
        this.heloWish = 'Good evening';
      }
      if(d.getHours() >= 20 && d.getHours() < 6){
        this.heloWish = 'Good night';
      }
  }

  // showTabs
  showTabs() {
    console.log('you selected: '+this.latestTabs);
  }

  // gotoProfilePage
  gotoProfilePage(id: number) {

    // send param and goto profile page
    this.navCtrl.push(ProfilePage, {
      id: id
    });
  }
}
