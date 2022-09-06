import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import {AuthGuard} from '../../services/guard/auth';
import {ListBookmakerComponent} from "../../components/bookmaker/list-bookmaker/list-bookmaker.component";

export const routes: Routes = [
  {
    path: '',
    data: { animation: 'abonnementPage'},
    canActivate: [ AuthGuard ],
    children: [
      {
        path: '',
        component: ListBookmakerComponent,
        data: { animation: 'bookmakersPage' },
      }
    ]
  },
]

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class BookmakersRoutingModule { }
