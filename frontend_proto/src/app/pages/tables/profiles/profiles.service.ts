import { Injectable } from '@angular/core';
import { Headers, RequestOptions, Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { Profile } from './profiles.interface';

@Injectable()
export class ProfileService {

  constructor(
    private http: Http
  ) { }

  getAllProfiles() {
    const url = `http://ak19237:8080/profils/all`;

    return this.http.get(url)
      .map((res: any) => {
        console.log(res);
        return res.json();
      })
      .catch(this.handleError);
  }

  /**
  * Error message display when catch is called
  * @param {*} error
  * @returns {Promise<any>}
  */
  handleError(error: any): Observable<any> {
    // console.error('An error occurred', error);
    return Observable.throw(error.message || error);
  }
}
