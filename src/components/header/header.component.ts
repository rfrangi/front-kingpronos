import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, NavigationEnd} from '@angular/router';

import {ToastService} from '../../services/toast.service';

import {TokenStorageService} from '../../services/token-storage.service';

@Component({
  selector:  'app-header',
  templateUrl: './header.component.html',
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
