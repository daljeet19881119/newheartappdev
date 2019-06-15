import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Navbar } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { UserProvider } from '../../providers/user/user';
import { GlobalProvider } from '../../providers/global/global';
import { ProfilePage } from '../profile/profile';


@IonicPage()
@Component({
  selector: 'page-user-bighearts',
  templateUrl: 'user-bighearts.html',
})
export class UserBigheartsPage {
  @ViewChild('navbar') navbar: Navbar;

  all_ngo: any = [];
  uuid: any;
  ngo_ids: any = [];
  user_id: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage, private userService: UserProvider, private global: GlobalProvider) {
  }

  ionViewDidLoad() {

    // get uuid and get user by uuid 
    if (this.global.uuid()!= "undefined") {
		  this.uuid = this.global.uuid();
		  this.userService.getUserByDeviceId(this.uuid).subscribe(data => {
		  let user_bighearts = data.data.user_bighearts.split(',');
		  this.user_id = data.data.user_id;

		  // create loader
		  this.global.createLoader('loading');

		  // getAllBHOfUser
		  this.userService.getAllBHOfUser(this.user_id).subscribe(all_bh => {
			// loop of all_bh
			all_bh.forEach(element => {
			  // check if bh id in array then store that id
			  if (user_bighearts.indexOf(element.user_id) != -1) {
				element.checked = true;
				this.ngo_ids.push(element.user_id);
			  }
			});

			this.all_ngo = all_bh;

			this.global.dismissLoader();
		  }, err => {
			console.log(err);
			this.global.dismissLoader();
		  });
		}, err => console.log(err));
    }
    else {
		  this.uuid = 'undefined';
		  
		  this.userService.getLoggedUserByUserId(this.global.GetUserId()).subscribe((data) => {
		  let user_bighearts = data.data.user_bighearts.split(',');
		  this.user_id = data.data.user_id;

		  // create loader
		  this.global.createLoader('loading');

		  // getAllBHOfUser
		  this.userService.getAllBHOfUser(this.user_id).subscribe(all_bh => {
			// loop of all_bh
			all_bh.forEach(element => {
			  // check if bh id in array then store that id
			  if (user_bighearts.indexOf(element.user_id) != -1) {
				element.checked = true;
				this.ngo_ids.push(element.user_id);
			  }
			});

			this.all_ngo = all_bh;

			this.global.dismissLoader();
		  }, err => {
			console.log(err);
			this.global.dismissLoader();
		  });
		}, err => console.log(err));
    }
    
    // save user bighearts on navbar back arrow click
    this.navbar.backButtonClick = () => {
      //this.saveUserBigheart();
      this.navCtrl.pop();
    };
  }

  // get ngo by charity name
  getNgoByCharity(selected_charity: any) {
    this.global.createLoader('loading');
    this.userService.getAllCharities().subscribe(data => {
      let charity_ids = [];
      data.forEach(element => {
        // check charity name in array then store that id
        if (selected_charity.indexOf(element.name) != -1) {
          charity_ids.push(element.id);
        }
      });

      // getNgoByCharityIds
      this.userService.getBHByCharityIds(charity_ids).subscribe(res => {

        res.forEach(element => {
          // get userdata from storage
          this.storage.get('user_data').then(data => {
            let ngo_ids = data.ngo_id.split(",");

            // check if ngo id in array then store that id
            if (ngo_ids.indexOf(element.id) != -1) {
              element.checked = true;
            }
          });
        });
        this.all_ngo = res;

        this.global.dismissLoader();
      }, err => {
        console.log(err);
        this.global.dismissLoader();
      });
    }, err => {
      console.log(err);
      this.global.dismissLoader();
    });
  }

  // getCurrentSelectedNgoId
  getCurrentSelectedNgoId(ngo_id: any, checked: any) {
    if (this.ngo_ids.indexOf(ngo_id) == -1) {
      if (checked == true) {
        this.ngo_ids.push(ngo_id);
      }
    }
    else {
      if (checked == true) {
        this.ngo_ids.push(ngo_id);
      }
      else {
        this.ngo_ids.pop(ngo_id);
      }
    }
  }

  // saveUserBighearts
  saveUserBigheart() {
    this.global.createLoader('loading');

    const data = {
      bh_id: this.ngo_ids,
      uuid: this.uuid,
	  user_id: this.user_id
    };

    this.userService.saveUserBighearts(data).subscribe(data => {
      if (data.msg == 'success') {
        this.storage.set('user_data', data);
      }
      this.global.dismissLoader();
    }, err => {
      console.log(err);
      this.global.dismissLoader();
    });
  }

  // viewBHProfile
  viewBHProfile(id: any) {
    
    // send param and goto profile page
    this.navCtrl.push(ProfilePage, {
      bh_id: id,
      user_id: this.user_id,
      uuid: this.uuid
    });
  }
}
