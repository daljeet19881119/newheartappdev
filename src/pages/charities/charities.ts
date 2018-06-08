import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { UserinfoPage } from '../userinfo/userinfo';

/**
 * Generated class for the CharitiesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-charities',
  templateUrl: 'charities.html',
})
export class CharitiesPage {

  
  animal_charity: string = 'Animal Charities';
  economic_development: string = 'Economic Development';
  environment: string = 'Environment';
  human_right: string = 'Human Rights';
  poverty_hunger: string = 'Poverty and Hunger';
  education: string = 'Education';
  geographic_preference: string = 'Geographic Preference(s)';

  animal_charity_val: boolean = false;
  economic_development_val: boolean = false;
  environment_val: boolean = false;
  human_right_val: boolean = false;
  poverty_hunger_val: boolean = false;
  education_val: boolean = false;
  geographic_preference_val: boolean = false;

  // mobileno and ccode from userinfo page
  mobileNo: any;
  c_code: any;
  fname: string;
  lname: string;
  email: string;
  charities: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController) {

    // get data from nav params
    this.mobileNo = this.navParams.get('mobileno');
    this.c_code = this.navParams.get('c_code');
    this.fname = this.navParams.get('fname');
    this.lname = this.navParams.get('lname');
    this.email = this.navParams.get('email');
    this.charities = this.navParams.get('charities');
    
    if(this.charities !== null)
    {
      // convert from object string into simple string
      let charities = JSON.stringify(this.charities);

      // replace brackets and then convert into an array
      let charityArr = charities.replace('[','').replace(']','').split(',');
      
      // start loop of array
      charityArr.forEach(element => {
          // check if charity found then show acitve
          if(element == '"'+this.animal_charity+'"')
          {
            this.animal_charity_val = true;
          }
          if(element == '"'+this.economic_development+'"')
          {
            this.economic_development_val = true;
          }
          if(element == '"'+this.environment+'"')
          {
            this.environment_val = true;
          }
          if(element == '"'+this.human_right+'"')
          {
            this.human_right_val = true;
          }
          if(element == '"'+this.poverty_hunger+'"')
          {
            this.poverty_hunger_val = true;
          }
          if(element == '"'+this.education+'"')
          {
            this.education_val = true;
          }
          if(element == '"'+this.geographic_preference+'"')
          {
            this.geographic_preference_val = true;
          }
      });
      
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CharitiesPage');
  }

  // getSelectedCharity
  getSelectedCharity(name: string, value: boolean) {
    let switchVal;

    if(value == true){
      switchVal = 'on';
    }else{
      switchVal = 'off';
    }

    console.log(name+' is '+switchVal);
  }

  // toggleValue() 
  toggleValue(name: string, value: boolean) {

    // check if matched then toggle value
    if(this.animal_charity == name){
      this.animal_charity_val = !value;
    }
    if(this.economic_development == name){
      this.economic_development_val = !value;
    }
    if(this.environment == name){
      this.environment_val = !value;
    }
    if(this.human_right == name){
      this.human_right_val = !value;
    }
    if(this.poverty_hunger == name){
      this.poverty_hunger_val = !value;
    }
    if(this.education == name){
      this.education_val = !value;
    }
    if(this.geographic_preference == name){
      this.geographic_preference_val= !value;
    }
  }

  // gotoUserinfoPage
  gotoUserinfoPage() {
    // send charities to userinfo page
    let charities = [
      {name: this.animal_charity, value: this.animal_charity_val},
      {name: this.economic_development, value: this.economic_development_val},
      {name: this.environment, value: this.environment_val},
      {name: this.human_right, value: this.human_right_val},
      {name: this.poverty_hunger, value: this.poverty_hunger_val},
      {name: this.education, value: this.education_val},
      {name: this.geographic_preference, value: this.geographic_preference_val}
    ];
    // this.navCtrl.push(UserinfoPage, {
    //       charities: charities, 
    //       mobileno: this.mobileNo, 
    //       country: this.c_code, 
    //       fname: this.fname, 
    //       lname: this.lname, 
    //       email: this.email
    // });
    
    // create modal
    const modal = this.modalCtrl.create(UserinfoPage, {
                        charities: charities, 
                        mobileno: this.mobileNo, 
                        country: this.c_code, 
                        fname: this.fname, 
                        lname: this.lname, 
                        email: this.email
                  });
          modal.present();
  }
}