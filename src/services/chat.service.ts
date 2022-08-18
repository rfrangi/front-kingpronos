import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import {HTTP_OPTIONS, URL_GATEWAY} from '../utils/fetch';

import {Commentaire} from '../models/commentaire.model';


import {PaginationService} from './pagination.service';

@Injectable({ providedIn: 'root' })
export class ChatService {

  constructor(private http: HttpClient) {}

  getByIdProno(idProno: string, params: any): Observable<any> {
    return this.http.post(URL_GATEWAY + `chat/pronostic/${idProno}/paginated`, params, HTTP_OPTIONS)
      .pipe(map((response: any) => {
        return {
          result: (response.content || []).map((p: any) => new Commentaire(p)),
          pagination: new PaginationService(response)
        };
      }));
  }

  addOnProno(idProno: string, commentaire: Commentaire): Observable<any> {
    return this.http.post(URL_GATEWAY + `chat/pronostic/${idProno}`, commentaire, HTTP_OPTIONS)
      .pipe(map((response: any) => {
        return {
          result: (response.content || []).map((p: any) => new Commentaire(p)),
          pagination: new PaginationService(response)
        };
      }));
  }

  delete(id: string): Observable<any> {
    return this.http.delete(URL_GATEWAY + `conversations/${id}`, HTTP_OPTIONS);
  }

}
