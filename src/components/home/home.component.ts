import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import {ActivatedRoute, Router} from '@angular/router';

import { forkJoin } from 'rxjs';

import {ToastService} from '../../services/toast.service';
import {PopinCodePromoComponent} from '../core/popin/popin-cod-promo/popin-code-promo.component';
import {PaginationService} from '../../services/pagination.service';
import { UserService } from '../../services/user.service';
import {GlobalParamService} from '../../services/global-param.service';
import {TokenStorageService} from '../../services/token-storage.service';
import {PronosticsService} from '../../services/pronostic.service';
import { PopinService } from '../../services/popin.service';

import {LIST_PROFIL} from '../../models/profil.model';
import { Pronostic } from '../../models/pronostic.model';
import {GlobalParams} from '../../models/global-params.model';

import { dateToday, dayDiff, startOfDay} from '../../utils/date-util';

@Component({
  selector:  'home',
  template: `
<ul class="onglets">
  <li [class.onglet-selected]="'PRIVE' === privacySelected"
      (click)="changePrivacy('PRIVE')">Pronos VIP</li>
  <li [class.onglet-selected]="'PUBLIC' === privacySelected"
      (click)="changePrivacy('PUBLIC')">Pronos Publics</li>
</ul>

<div class="col1" *ngIf="!mobileQuery.matches">
    <user-home></user-home>
    <reseaux-sociaux [hasTitle]="false" [globalParams]="globalParams" [isHomePage]="true" *ngIf="globalParams?.hasReseaux()"></reseaux-sociaux>
</div>

<div [class.col2]="!mobileQuery.matches">
  <list-prono [pronostics]="pronostics"></list-prono>
  <div class="pagination"
       *ngIf="pronostics
       && pronostics.length > 0
       && (tokenStorageService?.getUser()?.hasVIPValid() || privacySelected === 'PUBLIC')">
    <button mat-button
            name="btn-next"
            matTooltip="Page Précédente"
            [class.disabled]="pagination.isFirstPage"
            (click)="showMore()">
      Afficher plus
    </button>
  </div>
</div>
<div class="col3 gestion-abonnement" *ngIf="!mobileQuery.matches">
  <mat-card class="block" *ngIf="tokenStorageService?.isValid()">
    <mat-card-content>
      <img class="picto-vip" [src]="vip.img" [alt]="vip.code"/>
      <label class="message-vip">{{getMessageVIP()}}</label>
    </mat-card-content>
    <button mat-button class="btn-add-vip"
            color="primary"
            name="btn-go-to-abo"
            (click)="goToAbonnements()"
            *ngIf="!tokenStorageService?.getUser()?.hasProfilVIP()">
      Deve
      nir VIP
    </button>
  </mat-card>
  <mat-card class="block mat-card-code-prono" *ngIf="tokenStorageService?.isValid()">
    <button mat-button
            name="btn-valider"
            class="btn-add-code-prono"
            (click)="addCodeBonus()">
      Entrer un code bonus
    </button>
  </mat-card>
</div>
  `,
  styleUrls: ['./home.component.scss'],

})
export class HomeComponent implements OnInit {

  pronostics: Array<Pronostic> = [];
  privacySelected = 'PUBLIC';
  pagination: PaginationService = new PaginationService({});

  globalParams!: GlobalParams;
  vip = LIST_PROFIL.VIP;

  private mobileQueryListener: () => void;
  mobileQuery: MediaQueryList;

  constructor(public tokenStorageService: TokenStorageService,
              private router: Router,
              private toast: ToastService,
              private route: ActivatedRoute,
              private userService: UserService,
              private popinService: PopinService,
              private pronosticService: PronosticsService,
              private globalParamsService: GlobalParamService,
              private changeDetectorRef: ChangeDetectorRef,
              private media: MediaMatcher) {
    this.mobileQuery = this.media.matchMedia('(max-width: 951px)');
    this.mobileQueryListener = () => {
      this.changeDetectorRef.detectChanges();
    };
    this.mobileQuery.addListener(this.mobileQueryListener);
  }

  ngOnInit(): void {
    this.initData();

    // Detects if device is on iOS
    const isIos = () => {
      const userAgent = window.navigator.userAgent.toLowerCase();
      return /iphone|ipad|ipod/.test(userAgent);
    };
    // Detects if device is in standalone mode
    const isInStandaloneMode = () => ('standalone' in (window as any).navigator) && ((window as any).navigator.standalone);

    // Checks if should display install popup notification:
    if (isIos() && !isInStandaloneMode()) {
      setTimeout(() => {
        console.log(' Checks if should display install popup notification:');
      });
    }
  }

  changePrivacy(privacy: string): void {
    this.privacySelected = privacy;
    this.initData();
  }

  initData(): void {
    const params = Object.assign({ page: this.pagination.currentPage, privacy: this.privacySelected });
    this.popinService.showLoader();
    forkJoin(
      this.pronosticService.getAll(params),
      this.globalParamsService.get()
    ).subscribe(
      ([data, globalParams]) => {
        this.pronostics = data.result.filter((prono: any) => prono.privacy.code === this.privacySelected);
        this.pagination = data.pagination;
        this.globalParams = globalParams;
      },
      err => this.toast.genericError(err),
      () => this.popinService.closeLoader()
    );
  }

  getMessageVIP(): string {
    if (this.tokenStorageService?.getUser()?.hasVIPValid()) {
      return `Il vous reste ${dayDiff(dateToday(), startOfDay(this.tokenStorageService?.getUser()?.expiredVIPDate))} jours de VIP`;
    } else {
      return `aucun abonnement VIP`;
    }
  }

  goToAbonnements(): void {
    this.router.navigate([`abonnements`]);
  }

  addCodeBonus(): void {
    this.popinService.openPopin(PopinCodePromoComponent, {width: '400px', data: {codePromo: ''}}).subscribe(
      (data: any) => {
        if (data.result) {
          const codePromo = data.codePromo;
          this.userService.addCodeVIP( this.tokenStorageService?.getUser()?.id || '', codePromo).subscribe(
            user => {
              this.tokenStorageService.saveUser(user);
              this.toast.success(`Votre code est ajouté`);
            },
            err => {
              if (err.message === 'CODE_VIP_DISABLED') {
                this.toast.warning('Le code saisie et désactivé');
              } else if (err.message === 'CODE_VIP_NOT_FOUND') {
                this.toast.warning(`Le code saisie n'existe pas`);
              } else if (err.message === 'CODE_VIP_ALREADY_USED') {
                this.toast.warning('Vous avez déjà utilisé ce code');
              } else {
                this.toast.genericError(err);
              }
            }
          );
        }
    });
  }

  showMore(): void {
    const page = this.pagination.currentPage + 1;
    if (page >= 1 && page <= this.pagination.nbPages) {
      this.pagination.currentPage = page;

      const params = Object.assign({ page: this.pagination.currentPage, privacy: this.privacySelected });
      this.popinService.showLoader();
      this.pronosticService.getAll(params).subscribe(
        (data) => {
          this.pronostics = this.pronostics.concat(data.result).filter((prono: any) => prono.privacy.code === this.privacySelected);
          this.pagination = data.pagination;
        },
        err => this.toast.genericError(err),
        () => this.popinService.closeLoader()
      );
    }
  }
}
