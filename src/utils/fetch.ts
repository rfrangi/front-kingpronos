import {HttpHeaders } from '@angular/common/http';

export const URL_STOCKAGE = 'http://d11mhhwvxnv6xf.cloudfront.net/';

/* Environnement Test */
//export const URL_GATEWAY = 'https://protected-sierra-89708.herokuapp.com/';
//export const URL_GATEWAY = `http://localhost:8888/`;

/* Environnement Prod */
export const URL_GATEWAY = 'https://kingpronos.herokuapp.com/';
//export const URL_GATEWAY = 'https://pierrickpronos.herokuapp.com/';
//export const URL_GATEWAY = 'https://costellopronos.herokuapp.com/';

export const HTTP_OPTIONS = { headers: new HttpHeaders({ 'Content-Type': 'application/json' })};
