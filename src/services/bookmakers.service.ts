import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Abonnement } from '../models/abonnement.model';
import { PaginationService } from './pagination.service';

import {URL_GATEWAY, HTTP_OPTIONS} from '../utils/fetch';

import {User} from '../models/user.model';
import {Bookmaker} from "../models/bookmaker.model";

@Injectable({ providedIn: 'root' })
export class BookmakersService {

  constructor(private http: HttpClient) { }

  save(bookmaker: Bookmaker): Observable<Bookmaker> | Observable<any> {
    if (bookmaker.id){
      return this.http.put(URL_GATEWAY + `bookmakers/${bookmaker.id}`, bookmaker, HTTP_OPTIONS);
    }else {
      return this.http.post(URL_GATEWAY + `bookmakers`, bookmaker, HTTP_OPTIONS)
        .pipe(map(x => new Bookmaker(x)));
    }
  }

  delete(id: string): Observable<any>{
    return this.http.delete(URL_GATEWAY + `bookmakers/${id}`, HTTP_OPTIONS);
  }

  getAll(): Observable<any> {
    const url = 'bookmakers/all';
    return this.http.get(URL_GATEWAY + url, HTTP_OPTIONS)
      .pipe(map((response: any) => (response || []).map((p: any) => new Bookmaker(p))));
  }

  getById(id: string): Observable<Bookmaker> {
    let url = `bookmakers/${id}`;
    return this.http.get<Bookmaker>(URL_GATEWAY + url, HTTP_OPTIONS)
      .pipe(map(x => new Bookmaker(x)));
  }
}
