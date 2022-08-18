
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginFormComponent} from '../components/authen/login-form/login-form.component';
import {ForgotPasswordFormComponent} from '../components/authen/forgot-password-form/forgot-password-form.component';
import {SignupFormComponent} from '../components/authen/signup-form/signup-form.component';
import {HomeComponent} from '../components/home/home.component';
import {AuthGuard} from '../services/guard/auth';
import {AuthLoginGuard} from '../services/guard/auth-login';
import {MyAccountFormComponent} from '../components/gestion-user/my-account/my-account-form.component';
import { GestionBilanComponent } from '../components/admin/gestion-bilan/gestion-bilan.component';
import {PageAbonnementComponent} from '../components/abonnment/page-abonnement/page-abonnement.component';
import {ListPaiementComponent} from '../components/abonnment/list-paiement/list-paiement.component';
import {PageContactComponent} from '../components/support/page-contact/page-contact.component';
import {ListBookmakerComponent} from '../components/bookmaker/list-bookmaker/list-bookmaker.component';
import {MentionsLegalesComponent} from '../components/support/mentions-legales/mentions-legales.component';
import {GestionSupportComponent} from '../components/support/gestion-support/gestion-support.component';
import { AidesComponent } from '../components/support/aide/aides.component';
import {AbonnementsResolver} from '../resolver/abonnements.resolver';
import {GlobalparamResolver} from '../resolver/globalparams.resolver';

export const routes: Routes = [
  {
    path: '',
    component: LoginFormComponent,
    data: { animation: 'loginPage'}
  },
  {
    path: 'login',
    component: LoginFormComponent,
    data: { animation: 'loginPage'},
    canActivate: [ AuthLoginGuard ]},
  {
    path: 'forgot-password',
    component: ForgotPasswordFormComponent,
    data: { animation: 'forgotPasswordPage'},
    canActivate: [ AuthLoginGuard ]
  },
  { path: 'signup',
    component: SignupFormComponent,
    data: { animation: 'signupPage'},
    canActivate: [ AuthLoginGuard ]
  },

  { path: 'home', component: HomeComponent, data: { animation: 'homePage'}, canActivate: [ AuthGuard ] },
  { path: 'bilan', component: GestionBilanComponent, data: { animation: 'bilanPage'}, canActivate: [ AuthGuard ] },
  {
    path: 'account',
    component: MyAccountFormComponent,
    data: { animation: 'accountPage'},
    resolve: { globalParam: GlobalparamResolver },
    canActivate: [ AuthGuard ]
  },
  { path: 'support',
    canActivate: [ AuthGuard ],
    component: GestionSupportComponent,
    data: { animation: 'supportPage'},
    children: [
      { path: '', redirectTo: 'contacts', pathMatch: 'full'},
      { path: 'contacts', component: PageContactComponent, data: { animation: 'contactPage'},  canActivate: [ AuthGuard ] },
      { path: 'mentions_legales', component: MentionsLegalesComponent,
        data: { animation: 'mentionsLegalesPage'},  canActivate: [ AuthGuard ] },
      { path: 'aides', component: AidesComponent, data: { animation: 'aidesPage'},  canActivate: [ AuthGuard ] },
    ]
  },
  { path: 'chat', loadChildren: () => import('./chat/chat.module').then(p => p.ChatModule) },


  { path: 'abonnements',
    canActivate: [ AuthGuard ],
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

  { path: 'bookmakers',
    canActivate: [ AuthGuard ],
    children: [
      {
        path: '',
        component: ListBookmakerComponent,
        data: { animation: 'bookmakersPage' },
      }
    ]
  },
  { path: 'administration', loadChildren: () => import('./admin/admin.module').then(p => p.AdminModule) },
];
export const routing = RouterModule.forRoot(routes, {
  useHash: true
});

@NgModule({
  imports: [ RouterModule.forRoot(routes, { useHash: true }) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
