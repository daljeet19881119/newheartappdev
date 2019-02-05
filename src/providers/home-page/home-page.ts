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
      return this.http.get(this.global.apiUrl('/all_ngo/'+offset)).map(res => res.json());
  }
  
  // getRecommendedBigHearts()
  getRecommendedBigHearts(uuid: any) {
      return this.http.get(this.global.apiUrl('/recommended_bighearts/'+uuid)).map(res => res.json());
  }

  // getUserBighearts
  getUserDashboardData(user_id: any, offset: number = 0) {
    return this.http.get(this.global.apiUrl('/simple_user_dashboard/'+user_id+'/'+offset)).map(res => res.json());
  }

  // getNgoById
  getBHById(ngo_id: any) {
    return this.http.get(this.global.apiUrl('/bh/'+ngo_id)).map(res => res.json());
  }
}
