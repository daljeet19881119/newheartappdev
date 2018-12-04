import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { GlobalProvider } from '../global/global';

@Injectable()
export class HomePageProvider {

  constructor(private http: Http, private global: GlobalProvider) {
    console.log('Hello HomePageProvider Provider');
  }

  // getLatestDonations
  getLatestDonations(offset: number = 0) {
      return this.http.get(this.global.SITE_URL + '/new-latest-donations.php?offset='+offset).map(res => res.json());
  }

  // getLatestPayments
  getLatestPayments(offset: number = 0) {
    return this.http.get(this.global.SITE_URL + "/new-latest-payments.php?offset="+offset).map(res => res.json());
  }

  // getRecommendedBigHearts()
  getRecommendedBigHearts(uuid: any) {
      return this.http.get(this.global.SITE_URL + "/get-recommended-bighearts.php?uuid="+uuid).map(res => res.json());
  }

  // getUserBighearts
  getUserBighearts(user_id: any, offset: number = 0) {
    return this.http.get(this.global.SITE_URL + '/simple-user-dashboard.php?user_id='+user_id+'&offset='+offset).map(res => res.json());
    // return this.http.get(this.global.apiUrl('/simple_user_dashboard/'+user_id+'/'+offset)).map(res => res.json());
  }

  // getNgoById
  getNgoById(ngo_id: any) {
    return this.http.get(this.global.apiUrl('/ngo/'+ngo_id)).map(res => res.json());
  }
}
