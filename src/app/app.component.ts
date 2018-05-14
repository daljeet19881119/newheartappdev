import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { UniqueDeviceID } from '@ionic-native/unique-device-id';
import { WelcomePage } from '../pages/welcome/welcome';
import { HomePage } from '../pages/home/home';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = WelcomePage;
  uuid: any = null;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private http: Http, private uniqueDeviceID: UniqueDeviceID) {
    platform.ready().then(() => {

      // call func getDeviceID
     this.getDeviceID();

      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  // getDeviceID
  getDeviceID() {
    this.uniqueDeviceID.get()
      .then((uuid: any) => {
        this.uuid = uuid; 
        // call requestData
        this.requestData();
      })
      .catch((error: any) => {
        console.log(error);
      });
  }

  // requestData
  requestData() {

    this.http.get('http://ionic.dsl.house/heartAppApi/get-verified-user.php?uuid='+this.uuid).map(res => res.json()).subscribe(data => {
      console.log(data);
      
      if(this.uuid === data.data.uuid)
      {
        this.rootPage = HomePage;
      }
      else{
        this.rootPage = WelcomePage;
      }
      
    }, error => {
      console.log(error);
    });
  }
}

