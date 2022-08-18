
import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatDialog} from '@angular/material/dialog';
import {ToastService} from '../../../../services/toast.service';

import {validateForm, VALIDATION_ERROR} from '../../../../utils/validation';


export interface DialogData {
  password: string;
  confirm: string;
}

@Component({
  selector: 'popin-password-change',
  template: `
  <h1 mat-dialog-title>Changer votre mot de passe</h1>
  <form autocomplete="off" class="change-password-form hide-validation-errors" (submit)="isFormValid() && submit()">
      <div mat-dialog-content>
        <mat-form-field>
          <input matInput
                 placeholder="Mot de passe"
                 [(ngModel)]="data.password"
                 name="password"
                 required
                 #password="ngModel"
                 maxlength="30"

                 minlength="8"
                 [type]="hidePwd ? 'password' : 'text'">
          <button mat-icon-button
                  type="button"
                  name="btn-hide-pass"
                  matTooltip="Le mot de passe doit contenir 8 caractères minimum"
                  matSuffix (click)="hidePwd = !hidePwd"
                  tabindex="-1"
                  [attr.aria-pressed]="hidePwd">
            <mat-icon color="accent">{{hidePwd ? 'visibility_off' : 'visibility'}}</mat-icon>
          </button>
          <p class="error required" *ngIf="password.errors?.['required']">Veuillez saisir un mot de passe</p>
          <p class="error format" *ngIf="password.errors?.['minlength']">Ce mot de passe est trop court</p>
          <p class="error format" *ngIf="password.errors?.['maxlength']">Ce mot de passe est trop long</p>
        </mat-form-field>

        <mat-form-field>
          <input matInput
                 name="passwordConfirm"
                 placeholder="Confirmer le mot de passe"
                 [type]="hidePwdConfirm ? 'password' : 'text'"
                 [(ngModel)]="data.confirm"
                 #passwordConfirm="ngModel"
                 maxlength="30"
                 minlength="8"
                 required>
          <button mat-icon-button
                  matSuffix
                  tabindex="-1"
                  color="accent"
                  name="btn-hide-pass2"
                  matTooltip="Le mot de passe doit contenir 8 caractères minimum"
                  (click)="hidePwdConfirm = !hidePwdConfirm"
                  [attr.aria-label]="'Hide password'"
                  type="button"
                  [attr.aria-pressed]="hidePwdConfirm">
            <mat-icon>{{hidePwdConfirm ? 'visibility_off' : 'visibility'}}</mat-icon>
          </button>
          <p class="error required" *ngIf="passwordConfirm.errors?.['required']">Veuillez saisir un mot de passe</p>
          <p class="error format" *ngIf="passwordConfirm.errors?.['minlength']">Ce mot de passe est trop court</p>
          <p class="error format" *ngIf="passwordConfirm.errors?.['maxlength']">Ce mot de passe est trop long</p>
          <p class="error format" *ngIf="data.password !== data.confirm
                                          && !passwordConfirm.errors?.['minlength']
                                          && !passwordConfirm.errors?.['required']">
            les deux mots de passe sont différents
          </p>

        </mat-form-field>

      </div>
      <div mat-dialog-actions>
        <button mat-button
                type="button"
                name="btn-back"
                (click)="cancel()">Annuler</button>
        <button mat-raised-button
                name="btn-valider"
                color="primary" type="submit">Enregistrer</button>
      </div>
    </form>`,
  styleUrls: ['./popin-password-change.component.scss'],
})
export class PopinChangePasswordComponent {

  hidePwd: boolean = false;
  hidePwdConfirm: boolean = false;

  constructor(public dialog: MatDialog,
              private toast: ToastService,
              public dialogRef: MatDialogRef<PopinChangePasswordComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  isFormValid(): boolean {
    const result = validateForm({ selector: '.change-password-form'});
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
      password: this.data.password
    });
  }
}
