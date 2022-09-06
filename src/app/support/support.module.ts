import { NgModule } from '@angular/core';


import {SharedModule} from '../shared/shared.module';
import {CommonModule} from '@angular/common';
import {SupportRoutingModule} from './support-routing.module';
import {GestionSupportComponent} from "../../components/support/gestion-support/gestion-support.component";
import {PageContactComponent} from "../../components/support/page-contact/page-contact.component";
import {MentionsLegalesComponent} from "../../components/support/mentions-legales/mentions-legales.component";
import {AidesComponent} from "../../components/support/aide/aides.component";

@NgModule({
  declarations: [
    GestionSupportComponent,
    PageContactComponent,
    MentionsLegalesComponent,
    AidesComponent,
  ],
  imports: [
    SupportRoutingModule,
    CommonModule,
    SharedModule
  ]
})
export class SupportModule { }
