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
import { Editor, toHTML, toDoc, Toolbar  } from 'ngx-editor';
import {FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector:  'details-pronostic',
  templateUrl: './details-pronostic.component.html',
  styleUrls: ['./details-pronostic.component.scss'],

})
export class DetailsPronosticComponent implements OnInit {

  public pronostic!: Pronostic;
  globalParams!: GlobalParams;
  public MAX_LOGO_SIZE = 5 * 1024 * 1024;
  public url!: any;
  public LIST_PRIVACY = LIST_PRIVACY;
  private file!: File;
  public miseEuro: any;
  public editor!: Editor;
  public html: string = '';

  toolbar: Toolbar = [
    // default value
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['ordered_list', 'bullet_list'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];
  public form!: FormGroup;

  // make sure to destory the editor
  ngOnDestroy(): void {
    this.editor.destroy();
  }

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

  public hasError = (controlName: string, errorName: string) => {
    return this.form.controls[controlName].hasError(errorName);
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
    console.log(this.form);

    this.popinService.showLoader(`Enregistrement en cours...`);
    const prono = new Pronostic(this.pronostic.serialize());
    if(this.form.value.description) {
      prono.description = toHTML(this.form.value.description as any);
    }
    if (this.pronostic.id) {
      this.pronosticService.update(prono, this.file).subscribe(
        () => this.back(),
        err => this.toast.genericError(err),
        () => this.popinService.closeLoader()
      );
    } else {
      this.pronosticService.post(prono, this.file).subscribe(
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

  public initForm(pronostic: Pronostic): void {
    this.form = new FormGroup({
      description: new FormControl({
        value: pronostic.description || '',
        disabled: false
      }, [Validators.required, Validators.maxLength(300)]),
    });
  }

  onParamsChange(params: any): void {
    this.popinService.showLoader();
    this.editor = new Editor();
    if (params.idProno) {
      forkJoin(
        this.pronosticService.getById( params.idProno),
        this.globalParamsService.get()
      ).subscribe(
        ([pronostic, globalParams]) => {
          pronostic.description  = toDoc(pronostic.description) as any;
          this.pronostic = pronostic;
          this.initForm(this.pronostic);
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
          this.initForm(this.pronostic);
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

  public changeMisePourCentage(): void {
    this.miseEuro = Math.round(this.pronostic.mise * this.pronostic.bankroll / 100).toFixed(2);
  }

  public changeMise(): void {
    this.pronostic.mise = (this.miseEuro / this.pronostic.bankroll) * 100;
  }
}
