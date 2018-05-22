import { Component } from '@angular/core';
import { NavController, MenuController, NavParams, Platform } from 'ionic-angular';
import { ProfilePage } from '../profile/profile';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { UserProvider } from '../../providers/user/user';
import { UniqueDeviceID } from '@ionic-native/unique-device-id';

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
  name: string = 'Loading...';

  constructor(public navCtrl: NavController, public navParams: NavParams, public menuCtrl: MenuController, private http: Http, public platform: Platform, public userService: UserProvider, private uniqueDeviceID: UniqueDeviceID) {

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

      // if user try to go back then exitapp
      this.platform.registerBackButtonAction(() => {
        platform.exitApp();
      });

  }

  ionViewDidLoad() {
      // call func getDeviceID
      this.uniqueDeviceID.get()
      .then((uuid: any) => {

        // get login user data
        this.userService.getUserByDeviceId(uuid).subscribe((data) => {
          this.name = data.data.fname+' '+data.data.lname;        
        });
      })
      .catch((error: any) => {
        console.log(error);
      });    
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
