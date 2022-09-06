import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuard} from '../../services/guard/auth';
import {GestionSupportComponent} from "../../components/support/gestion-support/gestion-support.component";
import {PageContactComponent} from "../../components/support/page-contact/page-contact.component";
import {MentionsLegalesComponent} from "../../components/support/mentions-legales/mentions-legales.component";
import {AidesComponent} from "../../components/support/aide/aides.component";

export const routes: Routes = [
  { path: '',
    data: { animation: 'supportPage'},
    canActivate: [ AuthGuard ],
    component: GestionSupportComponent,
    children: [
      { path: '', redirectTo: 'contacts', pathMatch: 'full'},
      { path: 'contacts', component: PageContactComponent, data: { animation: 'contactPage'},  canActivate: [ AuthGuard ] },
      { path: 'mentions_legales', component: MentionsLegalesComponent,
        data: { animation: 'mentionsLegalesPage'},  canActivate: [ AuthGuard ] },
      { path: 'aides', component: AidesComponent, data: { animation: 'aidesPage'},  canActivate: [ AuthGuard ] },
    ]
  },
]

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class SupportRoutingModule { }
