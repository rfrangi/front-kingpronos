
import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

import {ToastService} from '../../../../services/toast.service';
import {Pronostic} from '../../../../models/pronostic.model';
import { LIST_PRONO_STATUS } from '../../../../models/pronostic-status.model';
import {validateForm, VALIDATION_ERROR} from '../../../../utils/validation';

export interface DialogData {
  pronostic: Pronostic;
}

@Component({
  selector: 'popin-confirm',
  template: `
    <h1>Mise à jour du Pronostic</h1>
    <form autocomplete="off"
          class="update-pronostic-form hide-validation-errors"
          *ngIf="data.pronostic"
          (submit)="isFormValid() && submit()">
      <div mat-dialog-content>

        <h3>Statut</h3>
        <mat-radio-group [(ngModel)]="data.pronostic.status"  name="status">
          <mat-radio-button
            *ngFor="let status of listStatus"
            [value]="status">{{status.label}}
          </mat-radio-button>
        </mat-radio-group>
        <h3>Score(s)</h3>
        <div class="match" *ngFor="let match of data.pronostic.matchs">
          <div class="equipe">
            <span class="label">{{ match.equipe1?.label }}</span>
            <span class="block-vs"><strong>VS</strong></span>
            <span class="label">{{ match.equipe2?.label }}</span>
          </div>
          <div class="div-scores">
            <img [src]="match.equipe1?.url" [alt]="match.equipe1?.label"/>
            <mat-form-field class="input-30">
              <input matInput
                     [(ngModel)]="match.scoreEq1"
                     #scoreEq1="ngModel"
                     maxlength="3"
                     name="score"
                     required
                     type="number">
            </mat-form-field>
            <span class="block-vs"><strong>-</strong></span>
            <mat-form-field class="input-30">
              <input matInput
                     [(ngModel)]="match.scoreEq2"
                     #scoreEq2="ngModel"
                     maxlength="3"
                     name="score"
                     required
                     type="number">
            </mat-form-field>
            <img  [src]="match.equipe2?.url" [alt]="match.equipe2?.label"/>
            <p class="error required"
               *ngIf="scoreEq2.errors?.['required'] || scoreEq1.errors?.['required']">
              Les scores sont obligatoire
            </p>
          </div>
        </div>
      </div>
      <div mat-dialog-actions>
        <button mat-button (click)="cancel()" type="button">Annuler</button>
        <button mat-raised-button color="primary" type="submit">Enregistrer</button>
      </div>
    </form>\`
  `,
  styleUrls: ['./popin-update-pronostic.component.scss'],
})
export class PopinUpdatePronosticComponent {

  listStatus = LIST_PRONO_STATUS;

  constructor(private toast: ToastService,
              public dialogRef: MatDialogRef<PopinUpdatePronosticComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    this.data = data;
  }

  isFormValid(): boolean {
    const result = validateForm({ selector: '.update-pronostic-form'});
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
      pronostic: this.data.pronostic
    });
  }
}

