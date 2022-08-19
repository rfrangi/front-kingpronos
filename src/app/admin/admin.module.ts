import { NgModule } from '@angular/core';

import {AdminRoutingModule} from './admin-routing.module';

import {SharedModule} from '../shared/shared.module';
import {CommonModule} from '@angular/common';

import {GestionAdminComponent} from '../../components/admin/gestion-admin/gestion-admin.component';

import {GestionParametresComponent} from '../../components/admin/gestion-parametres/gestion-parametres.component';

import {GestionCodeVipComponent} from '../../components/admin/gestion-code-vip/gestion-code-vip.component';
import {PopinCrudCodeVipComponent} from '../../components/core/popin/popin-crud-code-vip/popin-crud-code-vip.component';

import {GestionAbonnementComponent} from '../../components/admin/gestion-abonnement/gestion-abonnement.component';
import {PopinCrudAbonnementComponent} from '../../components/admin/popin-crud-abonnement/popin-crud-abonnement.component';

import {GestionUtilisateursComponent} from '../../components/admin/gestion-utilisateur/gestion-utilisateurs.component';
import {DetailsUtilisateurComponent} from '../../components/admin/details-utilisateur/details-utilisateur.component';

import {GestionPronosticsComponent} from '../../components/admin/gestion-pronostics/gestion-pronostics.component';
import {DetailsPronosticComponent} from '../../components/admin/details-pronostic/details-pronostic.component';
import {PopinAddMatchComponent} from '../../components/admin/popin-add-match/popin-add-match.component';
import {
  GestionBookmakerComponent
} from "../../components/admin/gestion-parametres/gestion-bookmakers/gestion-bookmakers.component";
import {
  PopinDetailsBookmakerComponent
} from "../../components/admin/gestion-parametres/gestion-bookmakers/popin-details-bookmaker/popin-details-bookmaker.component";
import {
  GestionContactsComponent
} from "../../components/admin/gestion-parametres/gestion-contacts/gestion-contacts.component";
import {
  GestionReseauxComponent
} from "../../components/admin/gestion-parametres/gestion-reseaux/gestion-reseaux.component";
import {
  GestionBankrollComponent
} from "../../components/admin/gestion-parametres/gestion-bankroll/gestion-bankroll.component";

@NgModule({
  declarations: [
    GestionAdminComponent,
    GestionParametresComponent,
    GestionCodeVipComponent,
    GestionAbonnementComponent,
    GestionUtilisateursComponent, DetailsUtilisateurComponent,
    GestionPronosticsComponent, DetailsPronosticComponent,
    GestionContactsComponent,
    PopinCrudCodeVipComponent,
    PopinCrudAbonnementComponent,
    PopinAddMatchComponent,
    GestionBookmakerComponent,
    PopinDetailsBookmakerComponent,
    GestionReseauxComponent,
    GestionBankrollComponent

  ],
  entryComponents: [
    PopinCrudCodeVipComponent,
    PopinCrudAbonnementComponent,
    PopinAddMatchComponent
  ],
  imports: [
    AdminRoutingModule,
    CommonModule,
    SharedModule
  ]
})
export class AdminModule { }
