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

<div class="d-flex flex-row justify-content-center align-items-start flex-fill">
<div class=" d-none d-lg-flex flex-column">
    <user-home></user-home>
    <reseaux-sociaux class="ms-3"
                     [hasTitle]="false"
                     [globalParams]="globalParams"
                     [isHomePage]="true" *ngIf="globalParams?.hasReseaux()"></reseaux-sociaux>
</div>

<div class="flex-grow-1 flex-fill">
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
<div class="d-none d-lg-flex flex-column">
  <mat-card class="block bg-dark ms-0" *ngIf="tokenStorageService?.isValid()">
    <mat-card-content class="d-flex flex-column align-items-center">
      <img class="w-25" [src]="vip.img" [alt]="vip.code"/>
      <label class="text-white">{{getMessageVIP()}}</label>
    </mat-card-content>
    <button mat-button class="btn-add-vip"
            color="primary"
            name="btn-go-to-abo"
            (click)="goToAbonnements()"
            *ngIf="!tokenStorageService?.getUser()?.hasProfilVIP()">
      Devenir VIP
    </button>
  </mat-card>
  <mat-card class="block bg-dark d-flex align-items-center ms-0" *ngIf="tokenStorageService?.isValid()">
    <button mat-button
            name="btn-valider"
            class="btn-add-code-prono flex-grow-1 flex-fill"
            (click)="addCodeBonus()">
      Entrer un code bonus
    </button>
  </mat-card>
</div>
</div>
  `,
  styleUrls: ['./home.component.scss'],

})
export class HomeComponent implements OnInit {

  public pronostics: Array<Pronostic> = [];
  public privacySelected = 'PUBLIC';
  public pagination: PaginationService = new PaginationService({});

  public globalParams!: GlobalParams;
  public vip = LIST_PROFIL.VIP;

  constructor(public tokenStorageService: TokenStorageService,
              private router: Router,
              private toast: ToastService,
              private route: ActivatedRoute,
              private userService: UserService,
              private popinService: PopinService,
              private pronosticService: PronosticsService,
              private globalParamsService: GlobalParamService) {
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

  public getMessageVIP(): string {
    const days = dayDiff(dateToday(), startOfDay(this.tokenStorageService.getUser()?.expiredVIPDate))
    if (this.tokenStorageService.getUser()?.hasProfilAdmin() || this.tokenStorageService.getUser()?.hasProfilSuperAdmin()) {
      if (days === 'NaN') {
        return `Vous êtes VIP à vie`;
      }
      return `Il vous reste ${days} jours de VIP`;
    }

    if (this.tokenStorageService.getUser()?.hasVIPValid()) {
      return `Il vous reste ${days} jours de VIP`;
    }
    return `aucun abonnement VIP`;
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
