import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import { forkJoin } from 'rxjs';

import {ToastService} from '../../../services/toast.service';
import {GlobalParamService} from '../../../services/global-param.service';
import {PopinService} from '../../../services/popin.service';

import {validateForm, VALIDATION_ERROR} from '../../../utils/validation';

import { Pronostic } from '../../../models/pronostic.model';
import { PronosticsService } from '../../../services/pronostic.service';
import { LIST_PRIVACY } from '../../../models/pronostic-privacy.model';
import { Match } from '../../../models/match.model';
import {GlobalParams} from '../../../models/global-params.model';
import {LIST_CATEGORIES} from '../../../models/categorie.model';

import {PopinAddMatchComponent} from '../popin-add-match/popin-add-match.component';

import {getDebutDate, getFinDate} from '../../../utils/date-util';
import {URL_STOCKAGE} from '../../../utils/fetch';

@Component({
  selector:  'details-pronostic',
  template: `
<form autocomplete="off"
    class="saisie-form hide-validation-errors"
    (submit)="isFormValid() && submit()"
    *ngIf="pronostic">
  <div class="block">
    <mat-form-field class="input-50 first-input">
      <input matInput
             [matDatepicker]="dateDebutPicker"
             placeholder=" Date de création"
             readonly
             required
             #debutDate="ngModel"
             (focus)="dateDebutPicker.open()"
             [(ngModel)]="pronostic.creationDate"
             name="dateDebutPicker">
      <mat-datepicker-toggle matSuffix [for]="dateDebutPicker" color="accent"></mat-datepicker-toggle>
      <mat-datepicker #dateDebutPicker color="accent"></mat-datepicker>
    </mat-form-field>
  </div>
  <ul>
    <li *ngFor="let match of pronostic.matchs">
      <details-match
        [match]="match"
        [pronoStatus]="pronostic.status"
        [isAdmin]="true"
        [isDetails]="true"
        (removeEmit)="removeMatch($event)">
      </details-match>
    </li>
  </ul>
  <div class="block">
    <a class="link-add-match"(click)="showPopinAddMatch()">
      Ajouter un {{ this.pronostic.matchs.length > 0 ? 'autre ' : ''}}match
    </a>
  </div>
  <div class="d-flex flex-column bg-dark p-3" *ngIf="pronostic.matchs.length > 0">
    <div class="d-flex flex-row me-2">
      <mat-form-field class="input-30 flex-grow-1">
      <input matInput
             placeholder="Mise en %"
             [(ngModel)]="pronostic.mise"
             (input)="changeMisePourCentage()"
             #mise="ngModel"
             maxlength="3"
             name="mise"
             required
             type="number">
            <p class="error required"
                       *ngIf="mise.errors?.['required']">
              La mise est obligatoire
             </p>
            <p class="error format"
                       *ngIf="mise.errors?.['maxLength']">
              La mise est trop importante
            </p>
      </mat-form-field>
      <mat-form-field class="input-30 px-2">
        <input matInput
               placeholder="Mise en €"
               [(ngModel)]="miseEuro"
               disabled
               maxlength="3"
               name="miseEuro"
               required
               type="number">
      </mat-form-field>
    </div>
    <div class="d-flex flex-row text-center  flex-grow-1 align-items-center justify-content-center flex-fill">
      <div class="d-flex flex-column text-center me-4">
        <label class="text-secondary">Cote&nbsp;total</label>
        <span class="cote-total rounded-circle border border-secondary text-white py-3">{{pronostic.calculCoteTotal}}</span>
      </div>
      <div class="d-flex flex-column mx-3">
        <label class="text-secondary">Bankroll</label>
        <span class="bankroll text-white">{{pronostic.bankroll}} €</span>
        <label class="text-secondary">Bénéfice</label>
        <span class="gain text-success "> + {{gain}} €</span>
      </div>
    </div>
  </div>
  <div div class="d-flex flex-column my-3 p-3 bg-dark">
    <div class="line ">
      <mat-form-field>
        <mat-select placeholder="Type"
                    [(ngModel)]="pronostic.privacy"
                    name="privacy"
                    #privacy="ngModel"
                    required>
          <mat-option *ngFor="let value of LIST_PRIVACY"
                      [value]="value">
            {{value.label}}
          </mat-option>
        </mat-select>
        <mat-error class="error required"
                   *ngIf="privacy.errors?.['required']">
          Le type est obligatoire
        </mat-error>
      </mat-form-field>
      <mat-checkbox [checked]="pronostic.fun"
                    [(ngModel)]="pronostic.fun"
                    name="fun">
        <span class="span-white">Pronostic Fun</span>
      </mat-checkbox>
    </div>
  </div>
  <div class="block block-form-description">
    <mat-form-field>
      <textarea matInput
                [(ngModel)]="pronostic.description"
                #description="ngModel"
                [required]="pronostic.matchs.length === 0"
                name="description"
                cdkAutosizeMinRows="1"
                cdkAutosizeMaxRows="50"
                placeholder="Description">
      </textarea>
      <p class="error required"
                 *ngIf="description.errors?.['required']">
        La description est obligatoire
      </p>
    </mat-form-field>
  </div>

  <div class="block block-upload">
    <file-base64
      [lblButton]="getLabelUpload()"
      onclass="add-prono"
      [allowedMimeTypes]="[ 'image/jpeg', 'image/png', 'image/gif' ]"
      [allowedExtensions]="[ 'JPEG', 'JPG', 'PNG', 'GIF' ]"
      [maxFileSize]="MAX_LOGO_SIZE"
      (fileRead)="changeLogo($event)"
      [isDisabled]="false">
    </file-base64>
    <ng-container *ngIf="getUrlImage()">
      <img class="image" [src]="getUrlImage()" alt="image">
    </ng-container>
  </div>
</form>
<div class="action">
  <button mat-stroked-button
          color="warn"
          name="back"
          class="prev"
          (click)="back()"
          type="button">
    Retour
  </button>
  <button mat-flat-button
          color="accent"
          name="suivant"
          class="next"
          (click)="isFormValid() && submit()"
          type="button">
    Valider
  </button>
</div>`,
  styleUrls: ['./details-pronostic.component.scss'],

})
export class DetailsPronosticComponent implements OnInit {

  public pronostic!: Pronostic;
  globalParams!: GlobalParams;
  public MAX_LOGO_SIZE = 5 * 1024 * 1024;
  public url!: any;
  public LIST_PRIVACY = LIST_PRIVACY;
  private file!: File;
  miseEuro: any;

  constructor(private router: Router,
              private toast: ToastService,
              private route: ActivatedRoute,
              private pronosticService: PronosticsService,
              private globalParamsService: GlobalParamService,
              private popinService: PopinService) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.onParamsChange(params);
    });
  }

  getUrlImage(): string| null {
    if (this.pronostic.urlImage && !this.url) {
      return URL_STOCKAGE + this.pronostic.urlImage;
    } else if (this.url) {
      return this.url;
    }
    return null;

  }

  submit(): void {
    this.popinService.showLoader(`Enregistrement en cours...`);
    if (this.pronostic.id) {
      this.pronosticService.update(this.pronostic, this.file).subscribe(
        () => this.back(),
        err => this.toast.genericError(err),
        () => this.popinService.closeLoader()
      );
    } else {
      this.pronosticService.post(this.pronostic, this.file).subscribe(
        prono => {
          this.pronostic = prono;
          this.back();
        },
        err => this.toast.genericError(err),
        () => this.popinService.closeLoader()
      );
    }
  }

  changeLogo(evt: any): void {
    if (evt) {
      this.file = evt.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(evt.target.files[0]);
      reader.onload = (event) => {
        this.url = event?.target?.result;
      };
    }
  }

  getLabelUpload(): string {
    return this.url ? `Changer l'image` : 'Ajouter une image';
  }

  onParamsChange(params: any): void {
    this.popinService.showLoader();
    if (params.idProno) {
      forkJoin(
        this.pronosticService.getById( params.idProno),
        this.globalParamsService.get()
      ).subscribe(
        ([pronostic, globalParams]) => {
          this.pronostic = pronostic;
          this.changeMisePourCentage();
          this.globalParams = globalParams;
        },
        err => this.toast.genericError(err),
        () => this.popinService.closeLoader()
      );
    } else {

      const paramsProno = {
        privacys: LIST_PRIVACY.map(value => value.code),
        categories: LIST_CATEGORIES.map(value => value.code),
        debutDate: getDebutDate(new Date()),
        finDate: getFinDate(new Date())
      };

      forkJoin(
        this.pronosticService.getForBilan(paramsProno),
        this.globalParamsService.get()).subscribe(
        ([pronostics, globalParams]) => {
          this.globalParams = globalParams;
          this.pronostic = new Pronostic(
            {bankroll: pronostics.length > 0 ? this.globalParams.bankrollCurrent : this.globalParams.bankrollDepart}
          );
        },
        err => this.toast.genericError(err),
        () => this.popinService.closeLoader()
      );
    }
  }

  isFormValid(): boolean {
    if (validateForm({ selector: '.saisie-form'})) {
      return true;
    }
    this.toast.error(VALIDATION_ERROR);
    return false;
  }

  back(): void {
    this.router.navigate(['administration', `pronostics`]);
  }

  removeMatch(match: Match): void {
    const index = this.pronostic.matchs.indexOf(match);
    if (index > -1) {
      this.pronostic.matchs.splice(index, 1);
    }
  }

  showPopinAddMatch(): void {
    const match = new Match();
    this.popinService.openPopin(PopinAddMatchComponent, {data: { match }}).subscribe(
      result => {
        if (result) {
          this.pronostic.matchs.push(match);
        }
    });
  }

  get gain(): any {
    return this.pronostic.mise ?
      ((this.pronostic.bankroll * (this.pronostic.mise / 100) * this.pronostic.calculCoteTotal)
        - (this.pronostic.bankroll * (this.pronostic.mise / 100))).toFixed(2) : 0;
  }


  public changeMisePourCentage() {
    this.miseEuro = this.pronostic.mise * this.pronostic.bankroll / 100;
  }
}
