import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import {AuthGuard} from '../../services/guard/auth';
import {GestionBilanComponent} from "../../components/admin/gestion-bilan/gestion-bilan.component";

export const routes: Routes = [
  { path: '',

    data: { animation: 'bilanPage'},
    canActivate: [ AuthGuard ],
    component: GestionBilanComponent
  },
]

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class BilanRoutingModule { }
