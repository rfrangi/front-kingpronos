import { Component, Input } from '@angular/core';

import { GlobalParams } from '../../../models/global-params.model';

@Component({
  selector:  'reseaux-sociaux',
  template: `
<div class="block bg-dark mt-3 rounded shadow mx-auto reseau" *ngIf="globalParams && globalParams.hasReseaux()" [class.is-home-page]="isHomePage">
  <h3 *ngIf="hasTitle" class="pt-3 px-3 fs-5">Rejoignez-nous</h3>
  <div class="d-flex flex-row p-3 justify-content-center align-items-center align-content-center">
    <a *ngIf="globalParams.urlFacebook"
       class=""
       [href]="globalParams.urlFacebook">
      <img src="assets/icons/reseaux/facebook.svg" class="w-100" alt="facebook" matTooltip="Facebook"/>
    </a>
    <a *ngIf="globalParams.urlSnapchat"
       class="mx-3"
       [href]="globalParams.urlSnapchat">
      <img src="assets/icons/reseaux/snapchat.svg" class="w-100" alt="snapchat" matTooltip="Snapchat"/>
    </a>
    <a *ngIf="globalParams.urlTelegram"
       [href]="globalParams.urlTelegram">
      <img src="assets/icons/reseaux/telegram.svg" class="w-100" alt="telegram" matTooltip="Telegram"/>
    </a>
    <a *ngIf="globalParams.urlTelegram"
       class="ms-3"
       [href]="globalParams.urlTelegram">
      <img src="assets/icons/reseaux/instagram.svg" class="w-100" alt="instagram" matTooltip="Instagram"/>
    </a>
  </div>
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
