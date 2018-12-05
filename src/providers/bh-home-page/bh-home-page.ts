import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Injectable } from '@angular/core';
import { GlobalProvider } from '../global/global';


@Injectable()
export class BhHomePageProvider {

  constructor(private http: Http, private global: GlobalProvider) {
    console.log('Hello BhHomePageProvider Provider');
  }

  getBigheartUsers(user_id: any, offset: number = 0) {
    return this.http.get(this.global.apiUrl('/bigheart_user_dashboard/'+user_id+'/'+offset)).map(res => res.json());
  }
}
