import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the HomePageProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class HomePageProvider {

  constructor(public httpClient: HttpClient, private http: Http) {
    console.log('Hello HomePageProvider Provider');
  }

  // getLatestDonations
  getLatestDonations(offset: number = 0) {
      return this.http.get('http://ionic.dsl.house/heartAppApi/new-latest-donations.php?offset='+offset).map(res => res.json());
  }

  // getLatestPayments
  getLatestPayments(offset: number = 0) {
    return this.http.get("http://ionic.dsl.house/heartAppApi/new-latest-payments.php?offset="+offset).map(res => res.json());
  }

  // getRecommendedBigHearts()
  getRecommendedBigHearts(uuid: any) {
      return this.http.get("http://ionic.dsl.house/heartAppApi/get-recommended-bighearts.php?uuid="+uuid).map(res => res.json());
  }
}
