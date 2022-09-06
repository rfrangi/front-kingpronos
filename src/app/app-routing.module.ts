
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginFormComponent} from '../components/authen/login-form/login-form.component';
import {ForgotPasswordFormComponent} from '../components/authen/forgot-password-form/forgot-password-form.component';
import {SignupFormComponent} from '../components/authen/signup-form/signup-form.component';
import {HomeComponent} from '../components/home/home.component';
import {AuthGuard} from '../services/guard/auth';
import {AuthLoginGuard} from '../services/guard/auth-login';
import {MyAccountFormComponent} from '../components/gestion-user/my-account/my-account-form.component';
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
  {
    path: 'account',
    component: MyAccountFormComponent,
    data: { animation: 'accountPage'},
    resolve: { globalParam: GlobalparamResolver },
    canActivate: [ AuthGuard ]
  },
  { path: 'chat', loadChildren: () => import('./chat/chat.module').then(p => p.ChatModule) },
  { path: 'bilan', loadChildren: () => import('./bilan/bilan.module').then(p => p.BilanModule) },
  { path: 'support', loadChildren: () => import('./support/support.module').then(p => p.SupportModule) },
  { path: 'abonnements', loadChildren: () => import('./abonnements/abonnement.module').then(p => p.AbonnementModule) },
  { path: 'bookmakers', loadChildren: () => import('./bookmakers/bookmakers.module').then(p => p.BookmakersModule) },
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
