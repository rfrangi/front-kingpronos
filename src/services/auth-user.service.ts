import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import {URL_GATEWAY, HTTP_OPTIONS} from '../utils/fetch';

import {User} from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthUserService {

  constructor(private http: HttpClient) { }

  login(credentials: any = {}): Observable<any> {
    return this.http.post(URL_GATEWAY + 'api/auth/signin', {
      username: credentials.email,
      password: credentials.password
    }, HTTP_OPTIONS);
  }

  signup(user: User): Observable<any> {
    return this.http.post(URL_GATEWAY + 'api/auth/signup', user.serialize(), HTTP_OPTIONS);
  }

  loginFB(params: any = {}): Observable<any> {
    params.urlPhotoFB = params?.response?.picture?.data?.url;
    return this.http.post(URL_GATEWAY + 'api/auth/fb', params, HTTP_OPTIONS);
  }
}
