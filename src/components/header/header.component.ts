import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, NavigationEnd} from '@angular/router';

import {ToastService} from '../../services/toast.service';

import {TokenStorageService} from '../../services/token-storage.service';

@Component({
  selector:  'app-header',
  providers: [],
  template: `
<mat-toolbar color="primary">
  <mat-toolbar-row>
    <h1 class="title-app" (click)="goToUrl(['home'])"></h1>
    <h4 class="title-page">{{ title }}</h4>
    <!-- <img src="assets/icons/logo.png" alt="logo"/>-->
    <mat-icon  class="icon-menu admin"
               mat-icon-button
               *ngIf="tokenStorage?.isValid()
               && (tokenStorage.getUser()?.hasProfilAdmin() || tokenStorage.getUser()?.hasProfilSuperAdmin())"
               [matMenuTriggerFor]="menuAdmin" aria-label="icon-button menu">more_vert
    </mat-icon>
    <mat-menu #menuAdmin="matMenu">
      <button mat-menu-item
              name="btn-go-to-url"
              *ngIf="tokenStorage.getUser()?.hasProfilSuperAdmin()"
              (click)="goToUrl(['administration', 'parametres', 'contacts'])">
        <mat-icon color="primary">build</mat-icon>
        Paramètres
      </button>
      <button mat-menu-item
              name="btn-ext"
              (click)="goToUrl(['administration', 'pronostics'])">
        <mat-icon color="primary">extension</mat-icon>
        Publications
      </button>
      <button mat-menu-item
              name="btn-user-circle" (click)="goToUrl(['administration', 'utilisateurs'])"
              *ngIf="tokenStorage.getUser()?.hasProfilAdmin()">
        <mat-icon color="primary">supervised_user_circle</mat-icon>
        Joueurs
      </button>
      <button mat-menu-item
              name="btn-star-half"
              (click)="goToUrl(['administration', 'codeVIP'])"
              *ngIf="tokenStorage.getUser()?.hasProfilAdmin()">
        <mat-icon  color="primary">star_half</mat-icon>
        Codes VIP
      </button>
      <button mat-menu-item
              name="btn-drama"
              *ngIf="tokenStorage.getUser()?.hasProfilSuperAdmin()"
              (click)="goToUrl(['administration', 'abonnements'])">
        <mat-icon  color="primary">filter_drama</mat-icon>
        Abonnements
      </button>
    </mat-menu>
  </mat-toolbar-row>
</mat-toolbar>

<ul class="nav-bar" *ngIf="tokenStorage?.isValid()">
  <li (click)="goToUrl(['account'])"
      [class.isActive]="TITLES.ACCOUNT.code == urlCurrent">
    <mat-icon color="primary">account_circle</mat-icon>
    <span class="text">Mon profil</span>
  </li>
  <li (click)="goToUrl(['abonnements'])"
      [class.isActive]="TITLES.ABONNEMENTS.code == urlCurrent
      || TITLES.PAIEMENT.code == urlCurrent
      || TITLES.BOOKMAKERS.code == urlCurrent">
    <mat-icon color="primary">filter_drama</mat-icon>
    <span class="text">Abonnements</span>
  </li>
  <li (click)="goToUrl(['home'])"
      [class.isActive]="TITLES.HOME.code == urlCurrent">
    <mat-icon color="primary">home</mat-icon>
    <span class="text">Accueil</span>
  </li>
  <li (click)="goToUrl(['bilan'])"
      [class.isActive]="TITLES.BILAN.code == urlCurrent">
    <mat-icon color="primary">bar_chart</mat-icon>
    <span class="text">Bilan</span>
  </li>
  <li (click)="goToUrl(['support'])"
      [class.isActive]="TITLES.MENTIONS_LEGALES.code == urlCurrent
      || TITLES.CONTACTS.code == urlCurrent
      || TITLES.SUPPORT.code == urlCurrent
      || TITLES.AIDES.code == urlCurrent">
    <mat-icon color="primary">help</mat-icon>
    <span class="text">Support</span>
  </li>
</ul>
  `
  ,
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  urlCurrent!: string;
  title!: string;

  TITLES = TITLES;

  constructor(private router: Router,
              private route: ActivatedRoute,
              public tokenStorage: TokenStorageService,
              private toast: ToastService) {}

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const index = event.url.indexOf('?');
        this.urlCurrent = (index !== -1 ? event.url.substring(0, index) : event.url).substr(1).toUpperCase();
        if (this.urlCurrent.indexOf('/') !== -1) {
          const array = this.urlCurrent.split('/');
          if (array.includes(TITLES.ABONNEMENTS.code)) {
            this.urlCurrent = array[array.length - 1];
          } else if (array.includes(TITLES.CONVERSATIONS.code)) {
            this.urlCurrent = array[0];
          } else if (array.includes(TITLES.SUPPORT.code) && array.includes(TITLES.MENTIONS_LEGALES.code)) {
            this.urlCurrent = TITLES.MENTIONS_LEGALES.code;
          } else if (array.includes(TITLES.SUPPORT.code) && array.includes(TITLES.AIDES.code)) {
              this.urlCurrent = TITLES.AIDES.code;
          } else if (array.includes(TITLES.SUPPORT.code) && array.includes(TITLES.CONTACTS.code)) {
            this.urlCurrent = TITLES.CONTACTS.code;
          } else if (array.includes(TITLES.ADMINISTRATION.code)
          && array.includes(TITLES.ADMINISTRATION.code)
          && array.includes(TITLES.AJOUTER.code)) {
            this.urlCurrent = array.length === 3 ? TITLES.AJOUTER_PRONOSTIC.code : TITLES.UPDATE_PRONOSTIC.code;
          }
        }
        this.title = TITLES[this.urlCurrent] ? TITLES[this.urlCurrent].title : '';
      }
    });
  }

  goToUrl(urls: Array<string> = []): void {
    this.router.navigate(urls);
  }

  logout(): void {
    const pseudo: string = this.tokenStorage.getUser()?.pseudonyme || '';
    this.tokenStorage.signOut();
    this.toast.success(`A bientôt ${pseudo}`);
    this.router.navigate([`login`]);
  }
}

export const TITLES: any = {
  HOME: { code: 'HOME', title: 'Pronostics' },
  ADMINISTRATION: { code: 'ADMINISTRATION',  title: 'Administration' },
  PRONOSTIC: { code: 'PRONOSTIC',  title: 'Pronostics' },
  AJOUTER: { code: 'AJOUTER', title: 'Ajouter'},
  AJOUTER_PRONOSTIC: { code: 'AJOUTER_PRONOSTIC', title: 'Ajouter un pronostic'},
  UPDATE_PRONOSTIC: { code: 'UPDATE_PRONOSTIC', title: 'Modifier le pronostic'},
  BILAN: { code: 'BILAN', title: 'Bilan'},
  ACCOUNT: { code: 'ACCOUNT', title: 'Profil'},
  CONVERSATIONS: { code: 'CONVERSATIONS', title: 'Conversations'},
  ABONNEMENTS: { code: 'ABONNEMENTS', title: 'Abonnements'},
  PAIEMENT: { code: 'PAIEMENT', title: 'Paiement'},
  BOOKMAKERS: { code: 'BOOKMAKERS', title: 'Bookmakers'},
  CONTACTS: { code: 'CONTACTS', title: 'Contacts'},
  AIDES: { code: 'AIDES', title: 'Aides' },
  MENTIONS_LEGALES: { code: 'MENTIONS_LEGALES', title: 'Mentions légales'},
  SUPPORT: { code: 'SUPPORT', title: 'Support' }
};
