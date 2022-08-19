import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {LIST_PROFIL} from '../../models/profil.model';

import {AuthGuard} from '../../services/guard/auth';
import {ProfilGuard} from '../../services/guard/profil-guard';

import {GestionCodeVipComponent} from '../../components/admin/gestion-code-vip/gestion-code-vip.component';
import {GestionAbonnementComponent} from '../../components/admin/gestion-abonnement/gestion-abonnement.component';
import {GestionAdminComponent} from '../../components/admin/gestion-admin/gestion-admin.component';
import {GestionUtilisateursComponent} from '../../components/admin/gestion-utilisateur/gestion-utilisateurs.component';
import {DetailsUtilisateurComponent} from '../../components/admin/details-utilisateur/details-utilisateur.component';
import {GestionPronosticsComponent} from '../../components/admin/gestion-pronostics/gestion-pronostics.component';
import {DetailsPronosticComponent} from '../../components/admin/details-pronostic/details-pronostic.component';
import {GestionParametresComponent} from "../../components/admin/gestion-parametres/gestion-parametres.component";
import {
  GestionBookmakerComponent
} from "../../components/admin/gestion-parametres/gestion-bookmakers/gestion-bookmakers.component";
import {
  GestionContactsComponent
} from "../../components/admin/gestion-parametres/gestion-contacts/gestion-contacts.component";
import {
  GestionReseauxComponent
} from "../../components/admin/gestion-parametres/gestion-reseaux/gestion-reseaux.component";
import {
  GestionBankrollComponent
} from "../../components/admin/gestion-parametres/gestion-bankroll/gestion-bankroll.component";

export const routes: Routes = [
  {
    path: '',
    component: GestionAdminComponent,
    data: {animation: 'gestionPronoPage', profils: [ LIST_PROFIL.ADMIN, LIST_PROFIL.SUPER_ADMIN ]},
    canActivate: [ AuthGuard, ProfilGuard ],
    children: [
      {
        path: 'parametres',
        data: { profils: [ LIST_PROFIL.SUPER_ADMIN ] },
        canActivate: [ AuthGuard, ProfilGuard ],
        component: GestionParametresComponent,
        children: [
          {
            path: 'bookmakers',
            data: { profils: [ LIST_PROFIL.SUPER_ADMIN ] },
            component: GestionBookmakerComponent
          },
          {
            path: 'contacts',
            data: { profils: [ LIST_PROFIL.SUPER_ADMIN ] },
            component: GestionContactsComponent
          },
          {
            path: 'reseaux-sociaux',
            data: { profils: [ LIST_PROFIL.SUPER_ADMIN ] },
            component: GestionReseauxComponent
          },
          {
            path: 'bankroll',
            data: { profils: [ LIST_PROFIL.SUPER_ADMIN ] },
            component: GestionBankrollComponent
          }
        ]
      },
      {
        path: 'codeVIP',
        data: { profils: [ LIST_PROFIL.ADMIN, LIST_PROFIL.SUPER_ADMIN ] },
        canActivate: [ AuthGuard, ProfilGuard ],
        component: GestionCodeVipComponent
      },
      {
        path: 'abonnements',
        data: { profils: [ LIST_PROFIL.ADMIN, LIST_PROFIL.SUPER_ADMIN ] },
        canActivate: [ AuthGuard, ProfilGuard ],
        component: GestionAbonnementComponent
      },
      {
        path: 'utilisateurs',
        children: [
          {
            path: '',
            canActivate: [ AuthGuard, ProfilGuard ],
            component: GestionUtilisateursComponent,
            data: {
              animation: 'gestionUsersPage',
              profils: [ LIST_PROFIL.ADMIN, LIST_PROFIL.SUPER_ADMIN ]
            },
          },
          {
            path: ':id',
            canActivate: [ AuthGuard, ProfilGuard ],
            component: DetailsUtilisateurComponent,
            data: {
              animation: 'updateUserPage',
              profils: [ LIST_PROFIL.ADMIN, LIST_PROFIL.SUPER_ADMIN ]
            },
          }
        ]
      },
      {
        path: 'pronostics',
        children: [
          {
            path: '',
            component: GestionPronosticsComponent,
            data: { animation: 'gestionPronoPage'},
          },
          {
            path: 'ajouter',
            component: DetailsPronosticComponent,
            data: { animation: 'addPronoPage'},
          },
          {
            path: ':idProno',
            component: DetailsPronosticComponent,
            data: { animation: 'updatePronoPage'},
          }
        ]
      },
    ]
  }
]

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class AdminRoutingModule { }
