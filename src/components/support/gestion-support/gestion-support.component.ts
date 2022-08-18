import { Component  } from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';

@Component({
  selector:  'gestion-support',
  template: `
    <ul class="onglets">
      <li [class.onglet-selected]="true" (click)="goToUrl(['support', 'contacts'])">
        Contacts
      </li>
       <li [class.onglet-selected]="" (click)="goToUrl(['support', 'aides'])">
         Aides
       </li>
    </ul>
    <router-outlet></router-outlet>
    <!--<div class="footer">
        <a (click)="goToUrl(['support', 'mentions_legales'])">Mentions Légales</a>
    </div>-->
  `,
  styleUrls: ['./gestion-support.component.scss'],

})
export class GestionSupportComponent {

  constructor(private route: ActivatedRoute, private router: Router) {}

  goToUrl(urls: Array<string> =[]): void {
    this.router.navigate(urls);
  }
}
