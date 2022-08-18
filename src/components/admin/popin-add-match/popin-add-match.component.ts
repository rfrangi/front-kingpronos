
import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatDialog} from '@angular/material/dialog';

import {ToastService} from '../../../services/toast.service';

import {Match} from '../../../models/match.model';
import {LIST_CATEGORIES} from '../../../models/categorie.model';
import {Equipe} from '../../../models/equipe.model';

import {validateForm, VALIDATION_ERROR} from '../../../utils/validation';

export interface DialogData {
  match: Match;
}

@Component({
  selector: 'popin-add-match',
  template: `
  <h1 mat-dialog-title>Ajouter un match</h1>
  <form autocomplete="off"
        class="saisie-match-form hide-validation-errors"
        (submit)="isFormValid() && submit()"
        *ngIf="data.match">
    <mat-form-field>
      <mat-select placeholder="Catégorie"
                  [(ngModel)]="data.match.categorie"
                  #categorie="ngModel"
                  name="categorie"
                  required>
        <mat-option *ngFor="let value of LIST_CATEGORIES" [value]="value" (click)="changeCategorie()">
          <img class="categorie"[src]="value.img" [alt]="value.label"/>
          {{value.label}}
        </mat-option>
      </mat-select>
      <p class="error format" *ngIf="categorie.errors?.['required']">
        La catégorie est obligatoire
      </p>
    </mat-form-field>
    <mat-form-field class="input-50 first-input">
      <input matInput
             [matDatepicker]="dateDebutPicker"
             placeholder="Date du Début"
             readonly
             required
             #debutDate="ngModel"
             (focus)="dateDebutPicker.open()"
             [(ngModel)]="data.match.debutDate"
             name="dateDebutPicker">
      <mat-datepicker-toggle matSuffix [for]="dateDebutPicker" color="accent"></mat-datepicker-toggle>
      <mat-datepicker #dateDebutPicker color="accent"></mat-datepicker>
     <p class="error required" *ngIf="debutDate.errors?.['required']">
        La date de début est obligatoire
      </p>
    </mat-form-field>
    <mat-form-field class="input-50">
      <input matInput placeholder="Cote"
             [(ngModel)]="data.match.cote"
             #cote="ngModel"
             name="cote"
             required
             type="number"
             maxlength="6">
      <button mat-icon-button
              matSuffix
              tabindex="-1"
              name="btn-add-eq1"
              type="button"
              matTooltip="Le nom de l'équipe">
        <mat-icon color="accent">account_balance</mat-icon>
      </button>
      <p class="error format"
                 *ngIf="cote.errors?.['required']">
        La cote est obligatoire
      </p>
    </mat-form-field>
    <mat-form-field class="input-50 first-input">
      <input matInput
             placeholder="Equipe n°1"
             [(ngModel)]="data.match.equipe1"
             name="equipe1"
             required
             (input)="loadEquipeByText(true)"
             #equipe1="ngModel"
             maxlength="30"
             [matAutocomplete]="auto2">
      <button mat-icon-button
              matSuffix
              name="btn-add-eq1-acc"
              tabindex="-1"
              type="button"
              matTooltip="Le nom de l'équipe">
        <mat-icon color="accent">accessibility</mat-icon>
      </button>
      <mat-autocomplete #auto2="matAutocomplete" [displayWith]="getLabelText">
        <mat-option *ngFor="let equipe of listEquipe1" [value]="equipe">
          <img aria-hidden [src]="equipe?.url" height="25">
          <span >{{equipe?.label}}</span>
        </mat-option>
      </mat-autocomplete>
      <p class="error required" *ngIf="equipe1.errors?.['required']">
        Le nom de l'équipe est obligatoire
      </p>
    </mat-form-field>
    <mat-form-field class="input-50">
      <input matInput
             placeholder="Equipe n°2"
             [(ngModel)]="data.match.equipe2"
             #equipe2="ngModel"
             name="equipe2"
             required
             (input)="loadEquipeByText(false)"
             type="text"
             maxlength="30"
             [matAutocomplete]="auto">
      <button mat-icon-button
              matSuffix
              tabindex="-1"
              name="btn-add-eq2"
              type="button"
              matTooltip="Le nom de l'équipe">
        <mat-icon color="accent">accessibility</mat-icon>
      </button>
      <mat-autocomplete #auto="matAutocomplete" [displayWith]="getLabelText">
        <mat-option *ngFor="let eq of listEquipe2" [value]="eq">
          <img aria-hidden [src]="eq?.url" height="25">
          <span>{{eq?.label}}</span>
        </mat-option>
      </mat-autocomplete>
      <p class="error format" *ngIf="equipe2.errors?.['required']">
        Le nom de l'équipe est obligatoire
      </p>
    </mat-form-field>
    <mat-form-field>
      <input matInput
             placeholder="Résultat"
             [(ngModel)]="data.match.titre"
             #prono="ngModel"
             name="prono"
             required
             maxlength="50">
      <button mat-icon-button
              matSuffix
              name="btn-add-eq2-note"
              tabindex="-1"
              type="button"
              matTooltip="Le nom de l'équipe">
        <mat-icon color="accent">notes</mat-icon>
      </button>
      <p class="error required" *ngIf="prono.errors?.['required']">
        Le résultat est obligatoire
      </p>
      </mat-form-field>
      <div mat-dialog-actions class="action">
          <button mat-button
                  type="button"
                  name="btn-back"
                  (click)="cancel()" class="btn-back">Annuler</button>
          <button mat-raised-button
                  name="btn-valider"
                  color="primary" type="submit">Enregistrer</button>
      </div>
  </form>
   `,
    styleUrls: ['./popin-add-match.component.scss'],
})
export class PopinAddMatchComponent implements OnInit {

  LIST_CATEGORIES = LIST_CATEGORIES;

  listEquipe1: Array<Equipe> = [];
  listEquipe2: Array<Equipe> = [];

  constructor(public dialog: MatDialog,
              private toast: ToastService,
              public dialogRef: MatDialogRef<PopinAddMatchComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  ngOnInit(): void {
    this.listEquipe1 = this.data.match.categorie.getEquipes();
    this.listEquipe2 = this.data.match.categorie.getEquipes();
  }

  cancel(): void {
    this.dialogRef.close(false);
  }

  submit(): void {
    this.data.match.equipe1 = this.checkEquipeInconnu(this.data.match.equipe1);
    this.data.match.equipe2 = this.checkEquipeInconnu(this.data.match.equipe2);
    this.dialogRef.close(true);
  }

  checkEquipeInconnu(equipe: any): Equipe {
    if (typeof equipe === 'string') {
      const nameEq: string = equipe;
      const eq = new Equipe();
      eq.categorie = this.data.match.categorie;
      eq.code = nameEq.toUpperCase().trim().replace(' ', '_');
      while (eq.code.includes(' ')) {
        eq.code = eq.code.replace(' ', '_');
      }
      eq.label = nameEq;
      eq.url = this.data.match.categorie.urlLogoInconnu;
      return eq;
    }
    return equipe;
  }

  isFormValid(): boolean | void {
    if (validateForm({ selector: '.saisie-match-form'})) {
      return true;
    }
    this.toast.error(VALIDATION_ERROR);
  }

  changeCategorie(): void {
    this.data.match.equipe1 = null;
    this.data.match.equipe1 = null;
    this.listEquipe1 = this.data.match.categorie.getEquipes();
    this.listEquipe2 = this.data.match.categorie.getEquipes();
  }

  toLowerCase(val: any): string {
    return val.toLowerCase();
  }

  loadEquipeByText(isEquipe1: boolean): void {
     if (isEquipe1) {
        this.listEquipe1 = this.data.match.categorie.getEquipes();
        this.listEquipe1 = this.listEquipe1.filter(
          equipe => equipe.label.toLowerCase().includes(this.toLowerCase(this.data.match.equipe1)));
    } else {
       this.listEquipe2 = this.data.match.categorie.getEquipes();
       this.listEquipe2 = this.listEquipe2.filter(
         equipe => equipe.label.toLowerCase().includes(this.toLowerCase(this.data.match.equipe2)));
     }
  }

  getLabelText(equipe: Equipe): string {
    return equipe ? equipe.label : '';
  }
}

