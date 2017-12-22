import { Injectable } from '@angular/core';
import { Headers, RequestOptions, Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'

import { Profile } from './profiles.interface';

@Injectable()
export class ProfileService {

  constructor(
    private http: Http
  ) { }

  getAllProfiles(): Observable<Profile[]> {
    const url = `http://ak19237:8080/profils/all`;

    return this.http.get(url)
      .map((res: Response) => {
        return res.json();
      });
  }
}
