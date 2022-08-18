import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatDialog} from '@angular/material/dialog';

import {ToastService} from '../../../../services/toast.service';

import {validateForm, VALIDATION_ERROR} from '../../../../utils/validation';

export interface DialogData {
  codePromo: string;
}

@Component({
  selector: 'popin-code-promo',
  template: `
  <h1>Ajouter un code bonus</h1>
  <form autocomplete="off" class="code-promo-form hide-validation-errors" (submit)="isFormValid() && submit()">
      <div mat-dialog-content>
        <mat-form-field>
          <input
            matInput
            [(ngModel)]="data.codePromo"
            placeholder="Entrez un code bonus"
            #codePromo="ngModel"
            name="codePromo"
            maxlength="10"
            minlength="2"
            oninput="this.value = this.value.toUpperCase()"
            required>
          <button mat-icon-button
                  matSuffix
                  tabindex="-1"
                  name="btn-star-half"
                  type="button">
            <mat-icon color="accent">star_half</mat-icon>
          </button>
          <p class="error required" *ngIf="codePromo.errors?.['required']">Veuillez saisir code bonus</p>
          <p class="error format" *ngIf="codePromo.errors?.['minlength']">Ce code est trop court</p>
          <p class="error format" *ngIf="codePromo.errors?.['maxlength']">Ce code est trop long</p>
        </mat-form-field>
      </div>
      <div mat-dialog-actions>
        <button
          mat-button
          (click)="cancel()"
          name="cancel"
          type="button">Annuler</button>
        <button
          mat-raised-button
          color="primary"
          name="submit"
          type="submit">Enregistrer</button>
      </div>
    </form>`,
  styleUrls: ['./popin-code-promo.component.scss'],
})
export class PopinCodePromoComponent {

  constructor(public dialog: MatDialog,
              private toast: ToastService,
              public dialogRef: MatDialogRef<PopinCodePromoComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  isFormValid(): boolean {
    const result = validateForm({ selector: '.code-promo-form'});
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
      codePromo: this.data.codePromo
    });
  }
}

