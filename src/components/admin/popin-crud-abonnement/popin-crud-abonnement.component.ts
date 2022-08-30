
import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormGroup, Validators, FormControl} from '@angular/forms';

import {ToastService} from '../../../services/toast.service';

import {VALIDATION_ERROR} from '../../../utils/validation';

import { Abonnement } from '../../../models/abonnement.model';

import {AbonnementService} from '../../../services/abonnement.service';

export interface DialogData {
  abonnement: Abonnement;
  confirm: string;
}

@Component({
  selector: 'popin-crud-abonnement',
  template: `
  <h1 mat-dialog-title>{{data.abonnement.id ? 'Modifier' : 'Ajouter'}}</h1>
  <form [formGroup]="abonnementForm" autocomplete="off" novalidate>
      <mat-form-field>
          <input matInput [(ngModel)]="data.abonnement.label" placeholder="Nom" formControlName="name" required>
          <mat-error *ngIf="hasError('name', 'required')">Nom obligatoire</mat-error>
      </mat-form-field>
      <mat-form-field>
          <input matInput [(ngModel)]="data.abonnement.description" placeholder="Description" formControlName="description" required>
          <mat-error *ngIf="hasError('description', 'required')">La description est obligatoire</mat-error>
      </mat-form-field>
      <mat-form-field>
          <input matInput [(ngModel)]="data.abonnement.price" placeholder="Prix" formControlName="price" required>
          <mat-error *ngIf="hasError('price', 'required')">Le prix est obligatoire</mat-error>
      </mat-form-field>
      <mat-form-field>
          <input matInput [(ngModel)]="data.abonnement.nbJour" placeholder="Nombre de jour" formControlName="nbJour" required>
          <mat-error *ngIf="hasError('nbJour', 'required')">Le nombre de jour est obligatoire</mat-error>
      </mat-form-field>
      <div mat-dialog-actions>
          <button mat-button
                  name="btn-cancel"
                  type="button"
                  (click)="cancel()"
                  class="btn-back">
            Annuler
          </button>
          <button mat-raised-button
                  color="primary"
                  name="btn-valider"
                  type="submit"
                  (click)="submit()">
            Enregistrer
          </button>
      </div>
  </form>
   `,
  styleUrls: ['./popin-crud-abonnement.component.scss'],
})
export class PopinCrudAbonnementComponent implements OnInit {

  public abonnementForm!: FormGroup;

  constructor(private abonnementService: AbonnementService,
              private toast: ToastService,
              public dialogRef: MatDialogRef<PopinCrudAbonnementComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  ngOnInit(): void {
    this.abonnementForm = new FormGroup({
      name: new FormControl(this.data && this.data.abonnement ? this.data.abonnement.label : '', [Validators.required]),
      description: new FormControl(this.data && this.data.abonnement.description ?
        this.data.abonnement.description : `Accès à l\'espace VIP (pronostics, analyse, gestion de bankroll)`,
        [Validators.required]),
      price: new FormControl(this.data && this.data.abonnement.price ? this.data.abonnement.price : '', [Validators.required]),
      nbJour: new FormControl(this.data && this.data.abonnement.nbJour ? this.data.abonnement.nbJour : '', [Validators.required])
    });
  }

  cancel(): void {
    this.dialogRef.close(false);
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.abonnementForm.controls[controlName].hasError(errorName);
  }

  submit(): void {
    if (this.abonnementForm.valid) {
      this.abonnementService.save(this.data.abonnement).subscribe(
        () => {
          this.toast.success(`L'abonnement est enregistré`);
          this.dialogRef.close(true);
        },
        err => this.toast.genericError(err)
      );
    } else {
      this.toast.error(VALIDATION_ERROR);
    }
  }
}

