import { HttpClient } from '@angular/common/http';
import {HttpHeaders } from '@angular/common/http';
import {Injectable} from '@angular/core';

import { Observable } from 'rxjs';

import { URL_GATEWAY} from '../utils/fetch';

import { Pronostic } from '../models/pronostic.model';

const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' })};

@Injectable({ providedIn: 'root' })
export class CommentaireService {

  constructor(private http: HttpClient) {}

  removeById(id: string): Observable<Pronostic> {
    return this.http.delete<Pronostic>(URL_GATEWAY + `chat/${id}`, httpOptions);
  }
}
