import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Abonnement } from '../models/abonnement.model';
import { PaginationService } from './pagination.service';

import {URL_GATEWAY, HTTP_OPTIONS} from '../utils/fetch';

import {User} from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AbonnementService {

  constructor(private http: HttpClient) { }

  getAllPaginated(params: any, isAdmin: boolean = false): Observable<any> {
    let url = isAdmin ? 'admin/' : '';
    url += `abonnements/paginated`
      +  `?searchTerm=${(params.searchTerm == null ? '' : encodeURIComponent(params.searchTerm))}`
      + `&sort=${(params.sortBy && params.sortOrder ? params.sortBy + ',' + params.sortOrder : 'label,ASC')}`
      + `&size=10&page=${(params.page > 0 ? params.page - 1 : 0)}`;

    return this.http.post(URL_GATEWAY + url, params, HTTP_OPTIONS)
      .pipe(map((response: any) =>  {
        return {
          result: (response.content || []).map((p: any) => new Abonnement(p)),
          pagination: new PaginationService(response)
        };
      }));
  }

  save(abonnement: Abonnement): Observable<Abonnement> | Observable<any> {
    if (abonnement.id){
      return this.http.put(URL_GATEWAY + `admin/abonnements/${abonnement.id}`, abonnement, HTTP_OPTIONS);
    }else {
      return this.http.post(URL_GATEWAY + `admin/abonnements`, abonnement, HTTP_OPTIONS)
        .pipe(map(x => new Abonnement(x)));
    }
  }

  delete(id: string): Observable<any>{
    return this.http.delete(URL_GATEWAY + `admin/abonnements/${id}`, HTTP_OPTIONS);
  }

  getAll(params: any): Observable<any> {
    const url = 'abonnements/all';
    return this.http.post(URL_GATEWAY + url, params, HTTP_OPTIONS)
      .pipe(map((response: any) => (response || []).map((p: any) => new Abonnement(p))));
  }

  getById(id: string, isAdmin: boolean = false): Observable<Abonnement> {
    let url = isAdmin ? 'admin/' : '';
    url += `abonnements/${id}`;

    return this.http.get<Abonnement>(URL_GATEWAY + url, HTTP_OPTIONS)
      .pipe(map(x => new Abonnement(x)));
  }

  addAbonnement(idAbonnement: string): Observable<any> {
    return this.http.get(URL_GATEWAY + `abonnements-user/${idAbonnement}`, HTTP_OPTIONS)
      .pipe(map(x => new User(x)));
  }
}
