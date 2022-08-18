import { Component, Input } from '@angular/core';

import { GlobalParams } from '../../../models/global-params.model';

@Component({
  selector:  'reseaux-sociaux',
  template: `
<div class="block rejoignez-nous" *ngIf="globalParams && globalParams.hasReseaux()" [class.is-home-page]="isHomePage">
  <h3 *ngIf="hasTitle">Rejoignez-nous</h3>
  <a *ngIf="globalParams.urlFacebook"
     [href]="globalParams.urlFacebook">
    <img src="assets/icons/facebook.svg" alt="facebook" matTooltip="Facebook"/>
  </a>
  <a *ngIf="globalParams.urlSnapchat"
     [href]="globalParams.urlSnapchat">
    <img src="assets/icons/snapchat.svg" alt="snapchat" matTooltip="Snapchat"/>
  </a>
  <a *ngIf="globalParams.urlTelegram"
     [href]="globalParams.urlTelegram">
    <img src="assets/icons/telegram.svg" alt="telegram" matTooltip="Telegram"/>
  </a>
  <a *ngIf="globalParams.urlTelegram"
     [href]="globalParams.urlTelegram">
    <img src="assets/icons/instagram.svg" alt="instagram" matTooltip="Instagram"/>
  </a>
</div>
  `,
  styleUrls: ['./reseaux-sociaux.component.scss'],

})
export class ReseauxSociauxComponent  {

  @Input() hasTitle: boolean = true;
  @Input() globalParams!: GlobalParams;
  @Input() isHomePage: boolean = false;

  constructor() {}
}
