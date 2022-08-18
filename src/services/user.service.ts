import {Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import {URL_GATEWAY, HTTP_OPTIONS} from '../utils/fetch';

import {PaginationService} from './pagination.service';

import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {

  constructor(private http: HttpClient) { }

  save(user: User, isModeAdmin = false): Observable<User> {
    const url = isModeAdmin ?  `admin/users` : 'users' + (user.id ? ('/' + user.id) : '');
    return this.http.post<User>(URL_GATEWAY + url, user.serialize(), HTTP_OPTIONS)
      .pipe(map(x => new User(x)));
  }

  saveLogo(user: User, file: File): Observable<User> {
    const formData = new FormData();
    formData.append('files', file);
    const url = `users/${user.id}/logo`;
    return this.http.put<User>(URL_GATEWAY + url, formData)
      .pipe(map(x => new User(x)));
  }

  update(user: User, isModeAdmin = false): Observable<any> {
    const url = (isModeAdmin ?  `admin/users` : 'users') + (user.id ? ('/' + user.id) : '');
    return this.http.put(URL_GATEWAY + url, user.serialize(), HTTP_OPTIONS);
  }

  delete(user: User): Observable<any> {
    return this.http.delete(URL_GATEWAY + `admin/users/${user.id}`, HTTP_OPTIONS);
  }

  getAll(params: any): Observable<any> {
    return this.http.post(URL_GATEWAY + `admin/users/paginated`, params, HTTP_OPTIONS)
      .pipe(map((response: any) =>  {
        return {
          result: (response.content || []).map((p: any) => new User(p)),
          pagination: new PaginationService(response)
        };
      }));
  }

  addCodeVIP(id: string, codePromo: string, isModeAdmin = false): Observable<User> {
    const url = (isModeAdmin ?  `admin/users/${id}/codeVIP/` : 'users/codeVIP/') + encodeURIComponent(codePromo) ;
    return this.http.get(URL_GATEWAY + url, HTTP_OPTIONS)
      .pipe(map(x => new User(x)));
  }

  addProfilPronostiqueur(id: string): Observable<any> {
    return this.http.get(URL_GATEWAY + `admin/users/${id}/pronostiqueur`, HTTP_OPTIONS);
  }

  addAbonnement(body: any): Observable<User> {
    return this.http.post(URL_GATEWAY + `users/${body.idUser}/abonnements/`, body, HTTP_OPTIONS)
      .pipe(map((response: any) => new User(response)));
  }

  getFacture(): Observable<any> {
    return this.http.get(`https://api.paypal.com/v2/checkout/orders/8VS17843E91443927`, HTTP_OPTIONS)
      .pipe(map((response: any) => console.log(response)));
  }


  changePassword(id: string, password: string, isAdmin = false): Observable<any> {
    return this.http.get(URL_GATEWAY + (isAdmin ? `admin/users/${id}/` : `users/`) + `password/${password}`, HTTP_OPTIONS);
  }

  forgotPassword(email: string): Observable<any>  {
    return this.http.get(URL_GATEWAY + `users/forgotpassword/${email}`, HTTP_OPTIONS);
  }

  getById( id: any): Observable<any>  {
    return this.http.get(URL_GATEWAY + `users/${id}`, HTTP_OPTIONS)
      .pipe(map((response: any) => new User(response)));
  }

  signup(user: any): Observable<User> {
    return this.http.post(URL_GATEWAY + `signup`, user, HTTP_OPTIONS)
      .pipe(map((response: any) => new User(response)));
  }

  count(): Observable<any>  {
    return this.http.get(URL_GATEWAY + `admin/users/count`, HTTP_OPTIONS);
  }

  countVIP(): Observable<any>  {
    return this.http.get(URL_GATEWAY + `admin/users/count-vip`, HTTP_OPTIONS);
  }

  changeProfilUser(user: User, profils: Set<string>): Observable<User> {
    return this.http.post(URL_GATEWAY + `admin/users/${user.id}/profils`, Array.from(profils), HTTP_OPTIONS)
      .pipe(map((response: any) => new User(response)));
  }
}
