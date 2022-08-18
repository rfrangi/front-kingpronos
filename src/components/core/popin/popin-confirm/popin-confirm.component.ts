
import {Component, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatDialog} from '@angular/material/dialog';

export interface DialogData {
  title: string;
  description: string;
  hasBtnBack: boolean;
  hasTitle: boolean;
  hasBtnConfirm: boolean;
  textConfirm: string;
  textBack: string;
}

@Component({
  selector: 'popin-confirm',
  template: `
  <h1 mat-dialog-title class="title" *ngIf="data.hasTitle">{{data.title ? data.title : 'Confirmer'}}</h1>
  <div class="content-popin-confirm">
      {{data.description ? data.description : 'Ajouter du text'}}
  </div>
  <div mat-dialog-actions>
    <button mat-button
            name="btn-back"
            (click)="cancel()"
            class="btn-back">{{data.textBack ? data.textBack : 'Annuler'}}</button>
    <button mat-raised-button
            color="primary"
            (click)="valider()"
            name="btn-valider"
            type="submit">{{data.textConfirm ? data.textConfirm : 'Valider'}}</button>
  </div>
  `,
  styleUrls: ['./popin-confirm.component.scss'],
})
export class PopinConfirmComponent {


  constructor(public dialog: MatDialog,
              public dialogRef: MatDialogRef<PopinConfirmComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  cancel(): void {
    this.dialogRef.close();
  }

  valider(): void {
    this.dialogRef.close(true);
  }

}

