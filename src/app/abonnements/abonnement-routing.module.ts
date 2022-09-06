import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import {AuthGuard} from '../../services/guard/auth';
import {PageAbonnementComponent} from "../../components/abonnment/page-abonnement/page-abonnement.component";
import {AbonnementsResolver} from "../../resolver/abonnements.resolver";
import {ListPaiementComponent} from "../../components/abonnment/list-paiement/list-paiement.component";

export const routes: Routes = [
  { path: '', data: { animation: 'abonnementPage'}, canActivate: [ AuthGuard ],
    children: [
          {
            path: '',
            component: PageAbonnementComponent,
            data: { animation: 'abonnementsPage' },
            resolve: {
              abonnements: AbonnementsResolver
            },
          },
          {
            path: ':id/paiement',
            component: ListPaiementComponent,
            data: { animation: 'paiementPage' },

          }
        ]
  },
]

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class AbonnementRoutingModule { }
