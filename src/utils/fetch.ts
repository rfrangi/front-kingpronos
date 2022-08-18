import {HttpHeaders } from '@angular/common/http';

export const URL_STOCKAGE = 'http://d11mhhwvxnv6xf.cloudfront.net/';

//export const URL_GATEWAY = 'https://protected-sierra-89708.herokuapp.com/';
export const URL_GATEWAY = 'https://kingpronos.herokuapp.com/';
//export const URL_GATEWAY = `http://localhost:8888/`;
export const HTTP_OPTIONS = { headers: new HttpHeaders({ 'Content-Type': 'application/json' })};

