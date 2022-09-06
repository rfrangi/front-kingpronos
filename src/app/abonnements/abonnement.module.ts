import { NgModule } from '@angular/core';


import {SharedModule} from '../shared/shared.module';
import {CommonModule} from '@angular/common';
import {AbonnementRoutingModule} from './abonnement-routing.module';
import {PageAbonnementComponent} from "../../components/abonnment/page-abonnement/page-abonnement.component";
import {ListPaiementComponent} from "../../components/abonnment/list-paiement/list-paiement.component";

import { NgxPayPalModule } from 'ngx-paypal';

@NgModule({
  declarations: [
    PageAbonnementComponent,
    ListPaiementComponent
  ],
  imports: [
    AbonnementRoutingModule,
    CommonModule,
    SharedModule,
    NgxPayPalModule
  ]
})
export class AbonnementModule { }
