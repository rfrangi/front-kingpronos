import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import {URL_GATEWAY, HTTP_OPTIONS} from '../utils/fetch';

import {PaginationService} from './pagination.service';
import { CodeVIP } from '../models/code-vip.model';

@Injectable({ providedIn: 'root' })
export class CodeVIPService {

  constructor(private http: HttpClient) { }

  getAll(params: any): Observable<any> {
    return this.http.post(URL_GATEWAY + `admin/codeVIP/paginated?page=${(params.page > 0 ? params.page - 1 : 0)}`, params,  HTTP_OPTIONS)
      .pipe(map((response: any) =>  {
        return {
          result: (response.content || []).map((p: any) => new CodeVIP(p)),
          pagination: new PaginationService(response)
        };
      }));
  }

  getById(id: string): Observable<CodeVIP> {
    return this.http.get(URL_GATEWAY + `codeVIP/${id}`, HTTP_OPTIONS)
      .pipe(map(x => new CodeVIP(x)));
  }
  add(code: CodeVIP): Observable<CodeVIP> {
    return this.http.post(URL_GATEWAY + `admin/codeVIP`, code.seralize(), HTTP_OPTIONS)
      .pipe(map(x => new CodeVIP(x)));
  }

  update(code: CodeVIP): Observable<any> {
    return this.http.put(URL_GATEWAY + `admin/codeVIP/${code.codeId}`, code.seralize(), HTTP_OPTIONS);
  }

  delete(id: string): Observable<any> {
    return this.http.delete(URL_GATEWAY + `admin/codeVIP/${id}`, HTTP_OPTIONS);
  }
}
