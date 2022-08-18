import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatDialog} from '@angular/material/dialog';

import {ToastService} from '../../../../services/toast.service';

import {validateForm, VALIDATION_ERROR} from '../../../../utils/validation';

export interface DialogData {
  pseudonyme: string;
}

@Component({
  selector: 'popin-pseudonyme',
  template: `
  <h1>Changer votre nom de joueur</h1>
  <form autocomplete="off" class="pseudonyme-form hide-validation-errors" (submit)="isFormValid() && submit()">
      <div mat-dialog-content>
        <mat-form-field>
          <input matInput
                 placeholder="Nom de joueur"
                 [(ngModel)]="data.pseudonyme"
                 name="pseudonyme"
                 required
                 #pseudonyme="ngModel"
                 maxlength="50"
                 minlength="5">
          <button mat-icon-button
                  matSuffix
                  name="btn-circle"
                  tabindex="-1"
                  type="button"
                  matTooltip="Le nom que les autres joueurs verront">
            <mat-icon color="accent">account_circle</mat-icon>
          </button>
          <p class="error required" *ngIf="pseudonyme.errors?.['required']">Veuillez choisir un nom de joueur</p>
          <p class="error format" *ngIf="pseudonyme.errors?.['minlength']">Le nom de joueur est trop court</p>
          <p class="error format" *ngIf="pseudonyme.errors?.['maxlength']">Le nom de joueur est trop long</p>
        </mat-form-field>
      </div>
      <div mat-dialog-actions>
        <button mat-button
                name="btn-back"
                (click)="cancel()"
                type="button">Annuler</button>
        <button mat-raised-button
                color="primary"
                name="btn-valider"
                type="submit">Enregistrer</button>
      </div>
    </form>`,
  styleUrls: ['../popin-cod-promo/popin-code-promo.component.scss'],
})
export class PopinPseudonymeComponent {

  constructor(public dialog: MatDialog,
              private toast: ToastService,
              public dialogRef: MatDialogRef<PopinPseudonymeComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  isFormValid(): boolean {
    const result = validateForm({ selector: '.pseudonyme-form'});
    if (!result) {
      this.toast.error(VALIDATION_ERROR);
    }
    return result;
  }

  cancel(): void {
    this.dialogRef.close({ result: false });
  }

  submit(): void {
    this.dialogRef.close({
      result: true,
      pseudonyme: this.data.pseudonyme
    });
  }
}

