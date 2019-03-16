import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UserProvider } from '../../providers/user/user';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { GlobalProvider } from '../../providers/global/global';


@IonicPage()
@Component({
  selector: 'page-card-details',
  templateUrl: 'card-details.html',
})
export class CardDetailsPage {

  user_cards: any;
  userObj: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, private userService: UserProvider, private iab: InAppBrowser, public global: GlobalProvider) {
    this.userObj = this.navParams.get('userObj');
  }

  ionViewDidLoad() {
    // show loader
    this.global.createLoader('Loading cards..');

    // get user cards
    this.userService.getUserCards({ user_id: this.userObj.user_id }).subscribe(cards => {
      // check if have cards
      this.user_cards = cards;

      this.global.dismissLoader();
    });
  }

  // add new card
  addNewCard() {
    let fullname = this.userObj.fname + ' ' + this.userObj.lname;
    let email = this.userObj.email;
    let user_id = this.userObj.user_id;
    let date = new Date();
    let random_no = date.getTime();

    const browser = this.iab.create(this.global.base_url('sqpayment/?name=' + fullname + '&email=' + email + '&user_id=' + user_id + '&unique_no=' + random_no), '_blank', 'location=yes');

    browser.show();

    browser.on('loadstop').subscribe(event => {
      browser.insertCSS({ code: "body{color: #ae0433;}h4{padding: 10px;}" });
    });

    browser.on('exit').subscribe(() => {
      // create loader
      this.global.createLoader('Please wait...');

      // set data to get user card
      const card_data = {
        user_id: this.userObj.user_id
      };

      // getUserById
      this.userService.getUserCards(card_data).subscribe(data => {
        this.user_cards = data;

        this.global.dismissLoader();
      });
    }, err => {
      console.error(err);
    });
  }

  // delete user card
  deleteCard(card_id: any) {
    // show loader
    this.global.createLoader('Deleting card..');

    // set card data
    const card_data = {
      card_id: card_id,
      user_id: this.userObj.user_id
    };
    this.userService.deleteUserCard(card_data).subscribe(cards => {
      this.user_cards = cards;

      this.global.dismissLoader();
    });
  }

  // makeDefaultCard
  makeDefaultCard(card: any) {
    // check if status 0
    if (card.status == '0') {
      this.global.createLoader('Making default card..');

      // set data to make default card
      const card_data = {
        user_id: this.userObj.user_id,
        card_id: card.card_id
      };

      this.userService.makeDefaultCard(card_data).subscribe(cards => {
        this.user_cards = cards;

        this.global.dismissLoader();
      });
    }
  }
}
