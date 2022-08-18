import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import {GlobalParams} from '../models/global-params.model';

import { URL_GATEWAY, HTTP_OPTIONS} from '../utils/fetch';

@Injectable({ providedIn: 'root' })
export class GlobalParamService {

  constructor(private http: HttpClient) {}

  get(): Observable<GlobalParams> {
    return this.http.get<GlobalParams>(URL_GATEWAY + 'globalparams', HTTP_OPTIONS)
      .pipe(map(x => new GlobalParams(x)));
  }

  save(globalparams: GlobalParams): Observable<GlobalParams> {
    return this.http.post(URL_GATEWAY + 'admin/globalparams', globalparams.serialize(), HTTP_OPTIONS)
      .pipe(map(x => new GlobalParams(x)));
  }
}



