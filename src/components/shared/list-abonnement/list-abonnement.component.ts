import { Component, EventEmitter, Input, Output} from '@angular/core';

import {Abonnement} from '../../../models/abonnement.model';

@Component({
  selector:  'list-abonnement',
  styleUrls: ['./list-abonnement.component.scss'],
  template: `
  <div class="block">
    <mat-card *ngFor="let abo of abonnements">
      <mat-card-content>
        <h2>{{abo?.label}}</h2>
        <span class="picto-price my-3">{{abo?.price}}&nbsp;€</span>
        <p class="abo-description">{{abo?.description}}</p>
      </mat-card-content>
      <mat-card-actions>
        <button *ngIf="!isModeAdmin"
                mat-button
                name="go-to-paiement"
                [mat-dialog-close]="abo"
                (click)="goToPaiement(abo)">
          Choisir
        </button>
        <ng-container *ngIf="isModeAdmin">
            <button name="btn-delete" mat-button (click)="delete(abo)">Supprimer</button>
            <button name="btn-update" mat-button (click)="update(abo)">Modifier</button>
        </ng-container>
      </mat-card-actions>
    </mat-card>
  </div>

  <p *ngIf="abonnements.length === 0" class="no-result">
    Aucun abonnement disponible pour le moment
  </p>
  `,
})
export class ListAbonnementComponent {

  @Input() abonnements: Array<Abonnement> = [];
  @Input() isModeAdmin: boolean = false;

  @Output() gotoPaiementEvent = new EventEmitter();
  @Output() gotoUpdateEvent = new EventEmitter();
  @Output() gotodeleteEvent = new EventEmitter();

  constructor() {}

  goToPaiement(abonnement: Abonnement): void {
    this.gotoPaiementEvent.emit(abonnement);
  }

  delete(abonnement: Abonnement): void {
    this.gotodeleteEvent.emit(abonnement);
  }

  update(abonnement: Abonnement): void {
    this.gotoUpdateEvent.emit(abonnement);
  }
}
