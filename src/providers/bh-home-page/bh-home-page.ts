import { Http, Headers, RequestOptions } from '@angular/http';
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

  // sendThankyouMessage
  sendThankyouMessage(data: any) {
    // set headers
    let headers = new Headers();    
    headers.append("Accept", 'application/json');
    
    // set request option
    let options = new RequestOptions({ headers: headers });

    // set data to be send
    let postdata = JSON.stringify({
        data: data
    });
    
    return this.http.post(this.global.apiUrl('/sendThankyouNotification'), postdata, options).map(res => res.json());
  }
}
