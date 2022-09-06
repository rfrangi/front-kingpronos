import { NgModule } from '@angular/core';
import { ServiceWorkerModule } from '@angular/service-worker';
import {CommonModule} from '@angular/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';

import {MatTabsModule} from '@angular/material/tabs';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from '../components/app/app.component';

import {environment} from '../environments/environment.prod';


import { LoginFormComponent } from '../components/authen/login-form/login-form.component';
import {HomeComponent} from '../components/home/home.component';
import {ForgotPasswordFormComponent} from '../components/authen/forgot-password-form/forgot-password-form.component';


import { ToastService } from '../services/toast.service';
import { AuthGuard } from '../services/guard/auth';

import {PopinMessageDuringComponent} from '../components/core/popin/popin-message-during/popin-message-during.component';
import {PopinChangePasswordComponent} from '../components/core/popin/popin-change-password/popin-password-change.component';
import {PopinCodePromoComponent} from '../components/core/popin/popin-cod-promo/popin-code-promo.component';
import {PopinConfirmComponent} from '../components/core/popin/popin-confirm/popin-confirm.component';
import {SignupFormComponent} from '../components/authen/signup-form/signup-form.component';
import {UserHomeComponent} from '../components/user/user-home.component';
import {HeaderComponent} from '../components/header/header.component';
import {UpdateAppService} from '../services/update-app.service';
import {PopinPronosticComponent} from '../components/core/popin/popin-pronostic/popin-pronostic.component';
import { FooterComponent } from '../components/footer/footer.component';
import {PopinUpdatePronosticComponent} from '../components/core/popin/popin-update-pronostic/popin-update-pronostic.component';

import {authInterceptorProviders } from '../providers/auth.interceptor';
import {SharedModule} from './shared/shared.module';
import {DetailsBookmakerComponent} from "../components/bookmaker/details-bookmaker/details-bookmaker.component";

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    PopinMessageDuringComponent,
    PopinChangePasswordComponent,
    PopinCodePromoComponent,
    LoginFormComponent,
    SignupFormComponent,
    ForgotPasswordFormComponent,
    HomeComponent,
    UserHomeComponent,
    PopinUpdatePronosticComponent,
    PopinConfirmComponent,
    PopinPronosticComponent,
    FooterComponent,
  ],
  imports: [
    SharedModule,
    MatTabsModule,
    RouterModule,
    HttpClientModule,
    BrowserAnimationsModule,
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
  ],
  entryComponents: [
    PopinMessageDuringComponent,
    PopinChangePasswordComponent,
    PopinCodePromoComponent,
    PopinConfirmComponent,
    PopinPronosticComponent,
    PopinUpdatePronosticComponent
  ],
  exports: [
    DetailsBookmakerComponent
  ],
  providers: [
    authInterceptorProviders,
    ToastService,
    AuthGuard,
    MatTabsModule,
    UpdateAppService,
   /* {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: true,
        providers: [
          /*{
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '624796833023-clhjgupm0pu6vgga7k5i5bsfp6qp6egh.apps.googleusercontent.com'
            ),
          },*/
       /*   {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider('929725564103836'),
          },*/
          /*{
            id: AmazonLoginProvider.PROVIDER_ID,
            provider: new AmazonLoginProvider(
              'amzn1.application-oa2-client.f074ae67c0a146b6902cc0c4a3297935'
            ),
          },*/
   //     ],
    //  } as SocialAuthServiceConfig
   // }
  ],
  bootstrap: [ AppComponent ],

})
export class AppModule { }
