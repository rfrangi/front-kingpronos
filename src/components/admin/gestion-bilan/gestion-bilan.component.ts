import { Component, OnInit, ViewChild } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';

import {
  ChartErrorEvent,
  ChartMouseLeaveEvent,
  ChartMouseOverEvent,
  ChartSelectionChangedEvent,
  ChartType
} from 'angular-google-charts';

import { forkJoin } from 'rxjs';

import {ToastService} from '../../../services/toast.service';
import {PronosticsService} from '../../../services/pronostic.service';
import { GlobalParamService } from '../../../services/global-param.service';
import {PopinService} from '../../../services/popin.service';

import { GlobalParams } from '../../../models/global-params.model';
import {Pronostic} from '../../../models/pronostic.model';
import { PRONO_STATUS } from '../../../models/pronostic-status.model';
import {LIST_PRIVACY, Privacy} from '../../../models/pronostic-privacy.model';
import {Categorie, LIST_CATEGORIES} from '../../../models/categorie.model';

import {transformDate, getMonthCurrent, getDebutDate, getFinDate} from '../../../utils/date-util';

@Component({
  selector:  'gestion-bilan',
  template: `
       <form [formGroup]="groupForm">

       <div class="block recherche" #container>
         <mat-form-field appearance="fill">
           <mat-label>Type(s)</mat-label>
           <mat-select formControlName="privacys" multiple>
             <mat-option (click)="onSubmit()" *ngFor="let value of privacyList" [value]="value">{{value.label}}</mat-option>
           </mat-select>
         </mat-form-field>

         <mat-form-field appearance="fill">
           <mat-label>Catégorie(s)</mat-label>
           <mat-select formControlName="categories" multiple>
             <mat-option (click)="onSubmit()" *ngFor="let value of categorieList" [value]="value">
               <img class="categorie" [src]="value.img" [alt]="value.label"/>
               {{value.label}}
             </mat-option>
           </mat-select>
         </mat-form-field>
       </div>
     <div class="block periode" *ngIf="dateSelected">
         <mat-icon (click)="changePeriode(true)">chevron_left</mat-icon>
         <div>{{ dateSelected | date: 'JANVIER YYYY'}}</div>
         <mat-icon (click)="changePeriode(false)">chevron_right</mat-icon>
       </div>
    </form>
    <div class="block chart" *ngIf="!loading && pronotics.length > 0" (window:resize)="initData()">
  <google-chart
        [dynamicResize]="chart.dynamicResize"
        [type]="chart.type"
        [data]="chart.data"
        [columns]="chart.columns"
        [options]="chart.options"
        (select)="onSelect($event)"
        (error)="onError($event)"
        (mouseleave)="onMouseLeave($event)">
      </google-chart>
    </div>
    <p *ngIf="pronotics.length === 0"
       class="no-result">
      Aucun résultat ne correspond à votre recherche
    </p>
    <div class="block nb-paris">
      <span>{{ nbParis }}</span>
      <label>Paris</label>
    </div>
    <div class="block benefice">
      <span>{{ benefice }}</span>
      <label>Bénéfice</label>
    </div>

  `,
  styleUrls: ['./gestion-bilan.component.scss'],

})
export class GestionBilanComponent {

    pronotics: Array<Pronostic> = [];
    globalParams!: GlobalParams;
    loading!: string;
    chart: any;

    nbParis!: number;
    benefice: any;

    @ViewChild('container') div: any;

    privacyList = LIST_PRIVACY;
    categorieList = LIST_CATEGORIES;

    groupForm!: FormGroup;

    filter: any = {};

    dateSelected: Date = new Date();

  constructor(private toast: ToastService,
              private popinService: PopinService,
              private route: ActivatedRoute,
              private router: Router,
              private pronosticService: PronosticsService,
              private globalParamService: GlobalParamService) {
  }

  ngOnInit(): void {
    this.initForm();
    this.initData();
  }

  onSubmit(): void {
    this.initData();
  }

  initForm(): void {
    this.dateSelected = new Date();
    this.groupForm = new FormGroup({
      privacys: new FormControl(this.privacyList),
      categories: new FormControl(this.categorieList),
      periodes: new FormControl(getMonthCurrent())
    });
  }

  createToolTipForBankrollDepart(date: string, bankroll: any): string {
    return '<div style="padding:10px;text-align: center;">' +
      '<strong style="color:orange;vertical-align: middle;display: inline-block;">'
      + date
      + '</strong><br/><br/><div>Bankroll de départ: <strong>' + bankroll + ' €' + '</strong></div></div>';
  }

  createToolTipForBankrollEnCours(prono: Pronostic | null, date: string, bankroll: any): string {
    if (!prono) {
      return '<div style="padding:10px;text-align: center;">' +
        '<strong style="color:orange;vertical-align: middle;display: inline-block;">'
        + date
        + '</strong><br/><br/><div>Bankroll: <strong>' + bankroll + ' €' + '</strong></div></div>';
    }

    let titre = '';
    prono.matchs.map(match => {
      titre += '<img style="width:15px;padding-right: 10px;vertical-align: middle;display: inline-block;" ' +
        'src="' + match.categorie.img + '" alt="' + match.categorie.label + '"/>'
        + '<span style="font-size: 16px; vertical-align: middle;display: inline-block;">' + match.titre + '</span>'
        + '<img style="width:15px;padding-left: 10px;vertical-align: middle;display: inline-block;" ' +
        'src="' + match.categorie.img + '" alt="' + match.categorie.label + '"/>'
        + '<br/>';
    });

    return '<div style="padding:10px;text-align: center;">' +
      '<strong style="color:orange;vertical-align: middle;display: inline-block;">' + date + '</strong>' +
      '<br/><br/><div style="color:#d84315;text-align: center;"><strong>'
      + titre
      + '</strong></div><br/>' +
      '<img style="width:15px;padding-right: 5px;vertical-align: middle;display: inline-block;' +
      '"src="' + prono.status.img + '" alt="' + prono.status.label + '"/>' +
      '<div style="vertical-align: middle;display: inline-block;">' + prono.getLabelGain() + '<strong>' + prono.gain + ' €</strong></div>' +
      '<div>Bankroll: <strong>' + bankroll + '</strong></div></div>';
  }

  initDataForGraph(): Array<any> {
    const result = [];

    const pronoFilter: Array<Pronostic> =
      this.pronotics
        .filter(prono => prono.status === PRONO_STATUS.SUCCESS || prono.status === PRONO_STATUS.FAILURE);
    let bankrollVariable = this.globalParams.bankrollDepart;
    if (pronoFilter.length > 0) {
      bankrollVariable = pronoFilter[0].bankroll;

      result.push([
        transformDate(getDebutDate(this.dateSelected), 'DD'),
        pronoFilter[0].bankroll,
        this.createToolTipForBankrollEnCours(null,
          transformDate(getDebutDate(this.dateSelected), 'DD JANVIER YYYY'), pronoFilter[0].bankroll),
        this.globalParams.bankrollDepart,
        this.createToolTipForBankrollDepart(
          transformDate(getDebutDate(this.dateSelected), 'DD JANVIER YYYY'), this.globalParams.bankrollDepart),
      ]);

      pronoFilter
        .forEach(prono => {

          const gain = Number(prono.calculGainWithBankroll(bankrollVariable));
          this.benefice += gain;
          result.push([
            transformDate(new Date(prono.creationDate), 'DD'),
            Number(bankrollVariable) + gain,
            this.createToolTipForBankrollEnCours(
              prono,
              transformDate(new Date(prono.creationDate), 'DD JANVIER YYYY'),
              (Number(bankrollVariable) + gain).toFixed(2) + ' €'),
            this.globalParams.bankrollDepart,
            this.createToolTipForBankrollDepart(
              transformDate(new Date(prono.creationDate), 'DD JANVIER YYYY'),
              this.globalParams.bankrollDepart),
          ]);
          bankrollVariable = Number(bankrollVariable) + gain;
        });
    } else {
      result.push([
        transformDate(getDebutDate(this.dateSelected), 'DD'),
        { v: this.globalParams.bankrollDepart, f:  this.globalParams.bankrollDepart + '€' },
        this.globalParams.bankrollDepart
      ]);

      result.push([
        transformDate(getFinDate(this.dateSelected), 'DD'),
        { v: this.globalParams.bankrollDepart, f:  this.globalParams.bankrollDepart + '€' },
        this.globalParams.bankrollDepart
      ]);
    }
    this.nbParis = pronoFilter.length > 0 ? pronoFilter.length : 0;
    this.benefice = this.benefice.toFixed(2) + ' €';
    return result;
  }

  initData(): void {
    const params = {
      privacys: this.groupForm.value.privacys ? this.groupForm.value.privacys.map((privacy: Privacy) => privacy.code) : [],
      categories: this.groupForm.value.categories ? this.groupForm.value.categories.map((categorie: Categorie) => categorie.code) : [],
      debutDate: getDebutDate(this.dateSelected),
      finDate: getFinDate(this.dateSelected),
      fun: false
    };

    this.loading = 'init';
    this.nbParis = 0;
    this.benefice = 0;

    this.popinService.showLoader();
    forkJoin(
      this.pronosticService.getForBilan(params),
      this.globalParamService.get()
    ).subscribe(
      ([pronostic, globalParams]) => {
        this.pronotics = pronostic;
        this.globalParams = globalParams;
        this.initChart();
      },
      err => this.toast.genericError(err),
      () => this.popinService.closeLoader()
    );
  }

  initChart(): void {
    this.chart = {
      type: ChartType.LineChart,
      dynamicResize: true,
      columns: ['Date', 'Bankroll', {type: 'string', role: 'tooltip',  p: {html: true}}, 'Bankroll de départ', {type: 'string', role: 'tooltip',  p: {html: true}}],
      data: this.initDataForGraph(),
      options: {
        titleTextStyle: {
          color: 'orange',    // any HTML string color ('red', '#cc00cc')
          // fontName: <string>, // i.e. 'Times New Roman'
          fontSize: 18, // 12, 18 whatever you want (don't specify px)
          // bold: <boolean>,    // true or false
          italic: true   // true of false
        },
        tooltip: {isHtml: true},
        pointSize: 7,
        width: this.div.nativeElement.offsetWidth,
        is3D : true,
        curveType: 'function',
        legend: { position: 'bottom', textStyle: {color: 'white', fontSize: 14, italic: true } },
        height: 250,
        backgroundColor: '#242424',
        colors: ['#ffa500', '#ff0000' ],
        vAxis: {
          textStyle: {color: '#5f686f', fontSize: 12, italic: true},
          gridlines: {
            color: '#242424'
          },
        },
        hAxis: {
          textStyle: {color: '#5f686f', fontSize: 12, italic: true, marginTop: 5},
          gridlines: {
            color: '#242424'
          },
        }
      }
    };
    this.loading = '';
  }

  public onError(error: ChartErrorEvent): void {
    console.error('Error: ' + error.message.toString());
  }

  public onSelect(event: ChartSelectionChangedEvent): void {
    console.log('Selected: ' + event.toString());
  }

  public onMouseEnter(event: ChartMouseOverEvent): void {
    console.log('Hovering ' + event.toString());
  }

  public onMouseLeave(event: ChartMouseLeaveEvent): void {
    console.log('No longer hovering ' + event.toString());
  }

  changePeriode(isBack: boolean = false): void {
    const month = this.dateSelected.getMonth();
    this.dateSelected.setMonth(isBack ? (month - 1) : (month + 1));
    this.dateSelected.setDate(new Date().getDay());
    this.dateSelected = new Date(this.dateSelected);
    this.onSubmit();
  }
}

