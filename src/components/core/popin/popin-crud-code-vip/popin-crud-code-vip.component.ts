import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

import {ToastService} from '../../../../services/toast.service';

import {validateForm, VALIDATION_ERROR} from '../../../../utils/validation';
import { CodeVIP } from '../../../../models/code-vip.model';

export interface DialogData {
  codeVIP: CodeVIP;
}

@Component({
  selector: 'popin-crud-code-vip',
  template: `
  <h1>Ajouter un code VIP</h1>
  <form autocomplete="off" class="crud-code-vip-form hide-validation-errors" (submit)="isFormValid() && submit()">
      <div mat-dialog-content>
        <mat-form-field>
          <input
            matInput
            [(ngModel)]="data.codeVIP.titre"
            placeholder="Entrez un titre"
            #title="ngModel"
            name="title"
            required>
          <button mat-icon-button
                  matSuffix
                  name="btn-title"
                  tabindex="-1"
                  type="button">
            <mat-icon color="accent">title</mat-icon>
          </button>
          <p class="error required" *ngIf="title.errors?.['required']">Veuillez saisir un titre</p>
          <p class="error format" *ngIf="title.errors?.['minlength']">Ce titre est trop court</p>
          <p class="error format" *ngIf="title.errors?.['maxlength']">Ce titre est trop long</p>
        </mat-form-field>
        <mat-form-field>
          <input
            matInput
            [(ngModel)]="data.codeVIP.code"
            placeholder="Entrez un code bonus"
            #codePromo="ngModel"
            name="codePromo"
            maxlength="10"
            minlength="2"
            oninput="this.value = this.value.toUpperCase()"
            required>
          <button mat-icon-button
                  matSuffix
                  name="btn-star-half"
                  tabindex="-1"
                  type="button">
            <mat-icon color="accent">star_half</mat-icon>
          </button>
          <p class="error required" *ngIf="codePromo.errors?.['required']">Veuillez saisir code VIP</p>
          <p class="error format" *ngIf="codePromo.errors?.['minlength']">Ce code est trop court</p>
          <p class="error format" *ngIf="codePromo.errors?.['maxlength']">Ce code est trop long</p>
        </mat-form-field>
        <mat-slide-toggle
          color="primary"
          name="isEnabled"
          labelPosition="before"
          [(ngModel)]="data.codeVIP.isEnabled">
          Activer
        </mat-slide-toggle>
        <mat-form-field>
          <input
            matInput
            type="number"
            [(ngModel)]="data.codeVIP.nbJoursVIP"
            placeholder="Entrez un nombre de jours VIP"
            #nbJoursVIP="ngModel"
            name="nbJoursVIP"
            required>
          <button mat-icon-button
                  matSuffix
                  name="btn-today"
                  tabindex="-1"
                  type="button">
            <mat-icon color="accent">today</mat-icon>
          </button>
          <p class="error required" *ngIf="nbJoursVIP.errors?.['required']">Veuillez saisir un nombre de jours</p>-->
        </mat-form-field>
      </div>
      <div mat-dialog-actions>
        <button mat-button
                (click)="cancel()"
                name="btn-back"
                type="button">Annuler</button>
        <button mat-raised-button
                name="btn-valider"
                color="primary" type="submit">Enregistrer</button>
      </div>
    </form>`,
  styleUrls: ['./popin-crud-code-vip.component.scss'],
})
export class PopinCrudCodeVipComponent {

  constructor(private toast: ToastService,
              public dialogRef: MatDialogRef<PopinCrudCodeVipComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  isFormValid(): boolean {
    const result = validateForm({ selector: '.crud-code-vip-form'});
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
      codeVIP: this.data.codeVIP
    });
  }
}

