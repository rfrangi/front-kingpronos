import { Component, OnInit } from '@angular/core';
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
import {BookmakersService} from "../../services/bookmakers.service";
import {Bookmaker} from "../../models/bookmaker.model";

@Component({
  selector:  'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],

})
export class HomeComponent implements OnInit {

  public pronostics: Array<Pronostic> = [];
  public bookmakers: Array<Bookmaker> = [];
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
              private bookmakerService: BookmakersService,
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
    this.popinService.showLoader(`Chargement des donn??es`);
    forkJoin(
      this.pronosticService.getAll(params),
      this.globalParamsService.get(),
      this.bookmakerService.getAll()
    ).subscribe(
      ([data, globalParams, bookmakers]) => {
        this.pronostics = data.result.filter((prono: any) => prono.privacy.code === this.privacySelected);
        this.pagination = data.pagination;
        this.globalParams = globalParams;
        this.bookmakers = bookmakers;
      },
      err => this.toast.genericError(err),
      () => this.popinService.closeLoader()
    );
  }

  public getMessageVIP(): string {
    const days = dayDiff(dateToday(), startOfDay(this.tokenStorageService.getUser()?.expiredVIPDate))
    if (this.tokenStorageService.getUser()?.hasProfilAdmin() || this.tokenStorageService.getUser()?.hasProfilSuperAdmin()) {
      if (days === 'NaN') {
        return `Vous ??tes VIP ?? vie`;
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
              this.toast.success(`Votre code est ajout??`);
            },
            err => {
              if (err.message === 'CODE_VIP_DISABLED') {
                this.toast.warning('Le code saisie et d??sactiv??');
              } else if (err.message === 'CODE_VIP_NOT_FOUND') {
                this.toast.warning(`Le code saisie n'existe pas`);
              } else if (err.message === 'CODE_VIP_ALREADY_USED') {
                this.toast.warning('Vous avez d??j?? utilis?? ce code');
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
