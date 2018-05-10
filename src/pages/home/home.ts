import { Component } from '@angular/core';
import { NavController, MenuController } from 'ionic-angular';
import { ProfilePage } from '../profile/profile';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  // icons
  icons: string = 'camera';

  // latestDonations
  latestDonations: any = [
    {img: 'assets/imgs/founder_Juccce.jpg', name: 'Juccce', date: '5/05/2018', heartCoin: 100, usd: '25.00', total: '10,048.39'},
    {img: 'assets/imgs/founder_OpenCity.jpg', name: 'Open City', date: '5/05/2018', heartCoin: 300, usd: '75.00', total: '10,048.39'},
    {img: 'assets/imgs/founder_ReviveCongo.jpg', name: 'Revive Congo', date: '5/05/2018', heartCoin: 10, usd: '25.00', total: '10,048.39'},
    {img: 'assets/imgs/founder_SaveTheChildren.png', name: 'Save The Children', date: '5/05/2018', heartCoin: 300, usd: '75.00', total: '10,048.39'}
  ];

  constructor(public navCtrl: NavController, public menuCtrl: MenuController) {
    
  }

  // showTabs
  showTabs() {
    console.log('you selected: '+this.icons);
  }

  // gotoProfile
  gotoProfile() {
    this.navCtrl.push(ProfilePage);
  }
}
