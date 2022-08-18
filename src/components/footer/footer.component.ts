import { Component } from '@angular/core';

@Component({
  selector:  'footer',
  template: `
    <div>
        <mat-icon>copyright</mat-icon>
        <a>KingPronos</a> | <a>Tous droits réservés</a> | <a>Application réalisée par Frangi Romain</a>
      <a>mentions légales</a>
    </div>
  `,
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {

  constructor() {}

}
