import { Component, Input, Output, EventEmitter} from '@angular/core';

import { Match } from '../../../models/match.model';
import {PronoStatus, PRONO_STATUS} from '../../../models/pronostic-status.model';
import { URL_LOGO_INCONNU } from '../../../models/categorie.model';

@Component({
  selector:  'details-match',
  styleUrls: ['./details-match.component.scss'],
  template: `
<p class="header-match" *ngIf="isDetails">
  <img [src]="match.categorie.img" [alt]="match.categorie.code"/>
  {{match.debutDate | date:'DD JANVIER YYYY à hh:mm'}}
  <mat-icon matTooltip="Retirer le match"
            color="primary"
            (click)="removeEmit.emit(match)">
    cancel_presentation
  </mat-icon>
</p>
<div class="match">
  <div class="equipe equipe1">
    <img [src]="match.equipe1 && match.equipe1.url ? match.equipe1.url : logoInconnu"
         [alt]="match.equipe1 && match.equipe1.code ? match.equipe1.code : 'LOGO_INCONNU'" class="logo-equipe">
    <span class="label">{{ match.equipe1?.label }}</span>
  </div>
  <span class="score"
        *ngIf="pronoStatus != LIST_PRONO_STATUS.IN_PROGRESS && pronoStatus != LIST_PRONO_STATUS.CANCEL">
    {{match.scoreEq1 || 0}}
  </span>
  <span class="block-vs">-</span>
  <span class="score"
        *ngIf="pronoStatus != LIST_PRONO_STATUS.IN_PROGRESS && pronoStatus != LIST_PRONO_STATUS.CANCEL">
    {{match.scoreEq2 || 0}}</span>
  <div class="equipe equipe2">
    <img [src]="match.equipe2 && match.equipe2.url ? match.equipe2.url : logoInconnu"
         [alt]="match.equipe2 && match.equipe2.code ? match.equipe2.code : 'LOGO_INCONNU'"
         class="logo-equipe">
    <span class="label">{{ match.equipe2?.label }}</span>
  </div>
</div>
<div class="info-match">
  <span class="titre">{{ match.titre }}</span>
</div>
  `,
})
export class DetailsMatchComponent {

  @Input() match!: Match;
  @Input() pronoStatus!: PronoStatus;
  @Input() isAdmin: boolean = false;
  @Input() isDetails: boolean = false;

  @Output() removeEmit = new EventEmitter();

  LIST_PRONO_STATUS = PRONO_STATUS;
  logoInconnu = URL_LOGO_INCONNU;
}
