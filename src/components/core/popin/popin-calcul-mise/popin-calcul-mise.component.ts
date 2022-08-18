import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatDialog} from '@angular/material/dialog';

export interface DialogData {
  mise: number;
  cote: number;
}

@Component({
  selector: 'popin-calcul-mise',
  template: `
  <h1 mat-dialog-title class="title" >Calculer ma Mise</h1>
  <form>
    <mat-form-field>
    <mat-label>Montant de votre bankroll</mat-label>
    <input matInput type="number" [(ngModel)]="value" name="value">
    <button mat-button  name="btn-close" matSuffix mat-icon-button>
      <mat-icon>close</mat-icon>
    </button>
    </mat-form-field>
    <p>
      {{ resultat }} €
    </p>
  </form>
  <div mat-dialog-actions>

    <button mat-button
            name="btn-back"
            type="button"
            (click)="cancel()" class="btn-back">Annuler</button>
  </div>
  `,
  styleUrls: ['./popin-calcul-mise.component.scss'],
})
export class PopinCalculMiseComponent {

  value!: number;

  constructor(public dialog: MatDialog,
              public dialogRef: MatDialogRef<PopinCalculMiseComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  cancel(): void {
    this.dialogRef.close();
  }

  get resultat(): any {
    return this.value && this.data && this.data.mise  ? ((this.value * (this.data.mise / 100))).toFixed(2) : 0;
  }
}
