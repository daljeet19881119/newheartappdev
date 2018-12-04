import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { UserProvider } from '../../providers/user/user';
import { GlobalProvider } from '../../providers/global/global';


@IonicPage()
@Component({
  selector: 'page-user-bighearts',
  templateUrl: 'user-bighearts.html',
})
export class UserBigheartsPage {

  loader: any;
  all_ngo: any;
  uuid: any;
  ngo_ids: any = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage, private userService: UserProvider, public loadingCtrl: LoadingController, private global: GlobalProvider) {
  }

  ionViewDidLoad() {
    // get userdata from storage
    this.storage.get('user_data').then(data => {
      this.getNgoByCharity(data.charity_type);
    });

    // get uuid
    if (this.global.uuid()) {
      this.uuid = this.global.uuid();
    }
    else {
      this.uuid = 'undefined';
    }
  }

  // get ngo by charity name
  getNgoByCharity(selected_charity: any) {
    this.createLoader();
    this.userService.getAllCharities().subscribe(data => {
      let charity_ids = [];
      data.forEach(element => {
        // check charity name in array then store that id
        if (selected_charity.indexOf(element.name) != -1) {
          charity_ids.push(element.id);
        }
      });

      // getNgoByCharityIds
      this.userService.getNgoByCharityIds(charity_ids).subscribe(res => {

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

        this.loader.dismiss();
      }, err => {
        console.log(err);
        this.loader.dismiss();
      });
    }, err => {
      console.log(err);
      this.loader.dismiss();
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

  // createLoader
  createLoader(msg: string = "loading") {
    this.loader = this.loadingCtrl.create({
      spinner: 'dots',
      content: msg
    });

    this.loader.present();
  }

  // saveUserBighearts
  saveUserBigheart() {
    this.createLoader();

    const data = {
      ngo_id: this.ngo_ids,
      uuid: this.uuid
    };

    this.userService.saveUserBighearts(data).subscribe(data => {
      if(data.msg == 'success')
      {
        this.storage.set('user_data', data);
      }      
      this.loader.dismiss();
    }, err => {
      console.log(err);
      this.loader.dismiss();
    });
  }
}
