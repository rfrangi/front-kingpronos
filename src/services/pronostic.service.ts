import { HttpClient } from '@angular/common/http';
import {HttpHeaders } from '@angular/common/http';
import {Injectable} from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { URL_GATEWAY} from '../utils/fetch';
import {PaginationService} from './pagination.service';
import {Commentaire} from '../models/commentaire.model';

import { Pronostic } from '../models/pronostic.model';

const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' })};

@Injectable({ providedIn: 'root' })
export class PronosticsService {

  constructor(private http: HttpClient) {}

  getById(id: string, hasChat: boolean = false): Observable<Pronostic> {
    return this.http.get<Pronostic>(URL_GATEWAY + `admin/pronostics/${id}?chat=${hasChat}`, httpOptions)
      .pipe(map(x => new Pronostic(x)));
  }

  update(pronostic: Pronostic, file: File | null): Observable<any> {
    const formData = new FormData();
    if (file) {
      formData.append('files', file);
    }
    formData.append('pronostic', JSON.stringify(pronostic.serialize()));
    return this.http.put(URL_GATEWAY + `admin/pronostics/${pronostic.id}`, formData);
  }

  post(pronostic: Pronostic, file: File): Observable<Pronostic> {

    const formData = new FormData();
    formData.append('files', file);
    formData.append('pronostic', JSON.stringify(pronostic.serialize()));
    return this.http.post(URL_GATEWAY + `admin/pronostics`, formData)
      .pipe(map(x => new Pronostic(x)));
  }

  remove(id: string): Observable<any> {
      return this.http.delete(URL_GATEWAY + `admin/pronostics/${id}`);
  }

  getAll(params: any, isAdmin: boolean = false): Observable<any> {
    let url = isAdmin ? 'admin/' : '';
    url += `pronostics/paginated`
      +  `?searchTerm=${(params.searchTerm == null ? '' : encodeURIComponent(params.searchTerm))}`
      + `&sort=${(params.sortBy && params.sortOrder ? params.sortBy + ',' + params.sortOrder : 'id,ASC')}`
      + `&size=${(isAdmin ? 10 : 3)}&page=${(params.page > 0 ? params.page - 1 : 0)}`;

    return this.http.post(URL_GATEWAY + url, params, httpOptions)
      .pipe(map((response: any) =>  {
        return {
          result: (response.content || []).map((p: any) => new Pronostic(p)),
          pagination: new PaginationService(response)
        };
      }));
  }

  likeProno(id: string): Observable<any> {
    return this.http.get(URL_GATEWAY + `pronostics/${id}/like`, httpOptions);
  }

  getForBilan(params: any = {}): Observable<Array<Pronostic>> {
    return this.http.post(URL_GATEWAY + 'pronostics/bilan', params, httpOptions)
      .pipe(map((response: any) =>
        (response || [])
        .map((res: any) => new Pronostic(res))
      ));
  }
}
