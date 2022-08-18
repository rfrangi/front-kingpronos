import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';

import {ToastService} from '../../../services/toast.service';
import {PopinService} from '../../../services/popin.service';
import {GlobalParamService} from '../../../services/global-param.service';

import { MyErrorStateMatcher } from '../../../utils/validation';

import {GlobalParams} from '../../../models/global-params.model';
import {Bookmaker} from "../../../models/bookmaker.model";

@Component({
  selector:  'gestion-parametres',
  template: `
  <form [formGroup]="groupForm" (ngSubmit)="onSubmit()" *ngIf="globalParams">
  <mat-accordion multi>
    <mat-expansion-panel class="block" [expanded]="step === 0" (opened)="setStep(0)" hideToggle>
      <mat-expansion-panel-header>
        <mat-panel-title>
          Contacts
        </mat-panel-title>
        <mat-icon>contact_mail</mat-icon>
      </mat-expansion-panel-header>

      <mat-form-field>
        <mat-label>Email</mat-label>
        <input matInput formControlName="mail" [errorStateMatcher]="matcher" required>
        <mat-error *ngIf="hasError('mail', 'email') && !hasError('mail', 'required')">
          Veuillez saisir une adresse email valide
        </mat-error>
        <mat-error *ngIf="hasError('mail', 'required')">
          Veuillez saisir une adresse email
        </mat-error>
      </mat-form-field>
      <mat-form-field>
        <mat-label>Email Coorporation</mat-label>
        <input matInput formControlName="mailCoorporation" required>
        <mat-error *ngIf="hasError('mailCoorporation', 'email') && !hasError('mailCoorporation', 'required')">
          Veuillez saisir une adresse email valide
        </mat-error>
        <mat-error *ngIf="hasError('mailCoorporation', 'required')">
          Veuillez saisir une adresse email
        </mat-error>
      </mat-form-field>
    </mat-expansion-panel>

    <mat-expansion-panel class="block" [expanded]="step === 1" (opened)="setStep(1)" hideToggle>
      <mat-expansion-panel-header>
        <mat-panel-title>
          Bankroll
        </mat-panel-title>
        <mat-icon>attach_money</mat-icon>
      </mat-expansion-panel-header>
      <mat-form-field>
        <mat-label>Bankroll de départ</mat-label>
        <input matInput formControlName="bankrollDepart" required>
      </mat-form-field>
      <mat-form-field>
        <mat-label>Bankroll courante</mat-label>
        <input matInput formControlName="bankrollCurrent">
      </mat-form-field>
    </mat-expansion-panel>

    <mat-expansion-panel class="block" [expanded]="step === 2" (opened)="setStep(2)" hideToggle>
      <mat-expansion-panel-header>
        <mat-panel-title>
          Réseaux sociaux
        </mat-panel-title>
        <mat-icon>public</mat-icon>
      </mat-expansion-panel-header>
      <p>
        <img src="assets/icons/snapchat.svg" alt="snapchat" matTooltip="Snapchat"/>
        <mat-form-field>
          <mat-label>URL Snapchat</mat-label>
          <input matInput formControlName="urlSnapchat">
        </mat-form-field>
      </p>
      <p>
        <img src="assets/icons/telegram.svg" alt="telegram" matTooltip="Telegram"/>
        <mat-form-field>
          <mat-label>URL Telegram</mat-label>
          <input matInput formControlName="urlTelegram">
        </mat-form-field>
      </p>
      <p>
        <img src="assets/icons/instagram.svg" alt="instagram" matTooltip="Instagram"/>
        <mat-form-field>
          <mat-label>URL Instagram</mat-label>
          <input matInput formControlName="urlInstagram">
        </mat-form-field>
      </p>
      <p>
        <img src="assets/icons/facebook.svg" alt="facebook" matTooltip="Facebook"/>
        <mat-form-field>
          <mat-label>URL Facebook</mat-label>
          <input matInput formControlName="urlFacebook">
        </mat-form-field>
      </p>
    </mat-expansion-panel>

    <mat-expansion-panel class="block" [expanded]="step === 3" (opened)="setStep(3)" hideToggle>
      <mat-expansion-panel-header>
        <mat-panel-title>
          Bookmakers
        </mat-panel-title>
        <mat-icon> money</mat-icon>
      </mat-expansion-panel-header>

      <div formArrayName="bookmakers"
           *ngFor="let item of getControls().controls; let i = index;">
        <img class="img-bookmaker"[src]="item.value.urlLogo" [alt]="item.value.name"/>
        <div [formGroupName]="i">

          <mat-form-field>
            <mat-label>Nom</mat-label>
            <input matInput formControlName="name">
          </mat-form-field>

          <mat-form-field>
            <mat-label>Description</mat-label>
            <input matInput formControlName="description">
          </mat-form-field>

          <mat-form-field>
            <mat-label>Lien</mat-label>
            <input matInput formControlName="url">
          </mat-form-field>

         <!-- <input formControlName="name" placeholder="Item name">
          <input formControlName="description" placeholder="Item description">
          <input formControlName="url" placeholder="Item price">-->
        </div>

      </div>
    </mat-expansion-panel>
    </mat-accordion>
    <div class="action">
      <button mat-flat-button
              color="accent"
              name="btn-valider"
              type="submit">
        Enregistrer
      </button>
    </div>
  </form>
  `,
  styleUrls: ['./gestion-parametres.component.scss'],

})
export class GestionParametresComponent implements OnInit {

  globalParams!: GlobalParams;
  groupForm: FormGroup = new FormGroup({});
  matcher = new MyErrorStateMatcher();
  step = 0;
  bookmakers = new FormArray([]);

  constructor(private popinService: PopinService,
              private router: Router,
              private route: ActivatedRoute,
              private toast: ToastService,
              private globalParamsService: GlobalParamService,
              private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.popinService.showLoader();
    this.initForm();
    this.globalParamsService.get().subscribe(
      globalParams => {
        this.globalParams = globalParams;
        this.initForm();
      },
      error => {
        this.toast.genericError(error);
      },
      () => this.popinService.closeLoader()
    );
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.groupForm.controls[controlName].hasError(errorName);
  }

  initForm(): void {
    this.groupForm = new FormGroup({
      globalparamsId: new FormControl(this.globalParams ? this.globalParams.globalparamsId : ''),
      mail: new FormControl(this.globalParams ? this.globalParams.mail : '',
        [ Validators.required, Validators.email ]),
      mailCoorporation: new FormControl(this.globalParams ? this.globalParams.mailCoorporation : '',
        [ Validators.required, Validators.email ]),
      bankrollDepart: new FormControl(this.globalParams ? this.globalParams.bankrollDepart : '',
        [ Validators.required]),
      bankrollCurrent: new FormControl({value: this.globalParams ? this.globalParams.bankrollCurrent : '', disabled: false}),
      urlSnapchat: new FormControl(this.globalParams ? this.globalParams.urlSnapchat : ''),
      urlTelegram: new FormControl(this.globalParams ? this.globalParams.urlTelegram : ''),
      urlInstagram: new FormControl(this.globalParams ? this.globalParams.urlInstagram : ''),
      urlFacebook: new FormControl(this.globalParams ? this.globalParams.urlFacebook : ''),
      bookmakers: this.formBuilder.array([])
    });

    if (this.globalParams) {
      // @ts-ignore
      this.bookmakers = this.groupForm.get('bookmakers') as FormArray;
      // @ts-ignore
      this.globalParams.bookmakers.forEach((bookmaker: Bookmaker) => this.bookmakers.push(this.formBuilder.group({
        id: bookmaker.id,
        name: bookmaker.name,
        description: bookmaker.description,
        url: bookmaker.url,
        urlLogo: bookmaker.urlLogo
      })));
    }
  }

  onSubmit(): void {
    const globalparams = new GlobalParams(this.groupForm.value);
    this.popinService.showLoader(`Enregistrement en cours...`);
    this.globalParamsService.save(globalparams).subscribe(
      globalParams => {
        this.globalParams = globalParams;
        this.toast.success(`Vos données sont enregistrées`);
        this.initForm();
      },
      error => {
        this.toast.genericError(error);
      },
      () => this.popinService.closeLoader()
    );
  }

  getControls(): any {
    return this.groupForm.get('bookmakers');
  }

  setStep(index: number): void {
    this.step = index;
  }

  nextStep(): void {
    this.step++;
  }

  prevStep(): void {
    this.step--;
  }
}
