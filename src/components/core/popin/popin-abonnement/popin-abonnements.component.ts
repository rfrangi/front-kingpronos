import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatDialog} from '@angular/material/dialog';

import {Abonnement} from '../../../../models/abonnement.model';

export interface DialogData {
  abonnements: Array<Abonnement>;
}

@Component({
  selector: 'popin-abonnements',
  template: `
  <h2 mat-dialog-title>Abonnement VIP</h2>
  <div class="block">
      <mat-card *ngFor="let abo of data.abonnements">
          <mat-card-content>
              <h2>{{abo?.label}}</h2>
              <span class="picto-price">{{abo?.price}} €</span>
              <p class="abo-description">
                  {{abo?.description}}
              </p>
          </mat-card-content>
          <mat-card-actions>
              <button name="btn-valider"
                      mat-button
                      [mat-dialog-close]="abo">Choisir</button>
          </mat-card-actions>
      </mat-card>
  </div>
   `,
  styleUrls: ['./popin-abonnements.component.scss'],
})
export class PopinAbonnementsComponent {


  constructor(public dialog: MatDialog,
              public dialogRef: MatDialogRef<PopinAbonnementsComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  cancel(): void {
    this.dialogRef.close();
  }
}

