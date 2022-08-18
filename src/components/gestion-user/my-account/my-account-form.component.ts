import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';


import {PopinChangePasswordComponent} from '../../core/popin/popin-change-password/popin-password-change.component';
import {PopinCodePromoComponent} from '../../core/popin/popin-cod-promo/popin-code-promo.component';
import {PopinPseudonymeComponent} from '../../core/popin/popin-pseudonyme/popin-pseudonyme.component';
import {PopinConfirmComponent} from '../../core/popin/popin-confirm/popin-confirm.component';

import {UserService} from '../../../services/user.service';
import {GlobalParamService} from '../../../services/global-param.service';
import {TokenStorageService} from '../../../services/token-storage.service';
import {ToastService} from '../../../services/toast.service';

import {dateToday, dayDiff, startOfDay} from '../../../utils/date-util';

import {LIST_PROFIL} from '../../../models/profil.model';
import {GlobalParams} from '../../../models/global-params.model';
import {User} from '../../../models/user.model';

import {PopinService} from '../../../services/popin.service';
import {URL_STOCKAGE} from '../../../utils/fetch';

@Component({
  selector:  'my-account-form',
  template: `
<div class="block block-vip" *ngIf="tokenStorage.getUser()?.hasVIPValid()">
    <img class="picto-vip" [src]="vip.img" [alt]="vip.code"/>
    <label class="message-vip">{{getMessageVIP()}}</label>
    <span class="expire-vip-label" *ngIf="tokenStorage.getUser()?.expiredVIPDate">Expire le {{tokenStorage.getUser()?.expiredVIPDate | date:'DD JANVIER YYYY à hh:mm'}}</span>
</div>
<div class="block no-vip" *ngIf="!tokenStorage.getUser()?.hasVIPValid()">
  <span class="no-member">Toujours pas membre VIP ?</span>
  <br/>
  <button mat-button
          class="btn-add-vip"
          color="primary"
          name="btn-vip"
          (click)="goToAbonnements()">
    Devenir VIP
  </button>
</div>
<div class="block">
  <h3>{{tokenStorage.getUser()?.login}}</h3>
  <div class="line" *ngIf="logoDataUrl" >
      <img [src]="logoDataUrl" alt="logo-user" [class.logo-default]="!tokenStorage.getUser()?.logo" class="logo-user"/>
  </div>
  <div class="line">
    <mat-icon matTooltip="Pour chaque amis parrainé, recevez, vous et votre amis, 2 jours de VIP">star</mat-icon>
    <label>Code parrain</label>
    <span>{{tokenStorage.getUser()?.codeParrain}}</span>
  </div>

  <div class="line">
    <mat-icon>{{ tokenStorage.getUser()?.hasNotification ? 'notifications_active' : 'notifications_off' }}</mat-icon>
    <label>Notifications</label>
    <span class="span-slide"
          (click)="changeNotif()">
        <mat-slide-toggle [disabled]="true"
          color="primary">
        </mat-slide-toggle>
      </span>
  </div>
  <div class="line">
    <mat-icon matTooltip="Permet l'ajout de code promotionel">star_half</mat-icon>
    <label>Code bonus</label>
    <button class="valider"
            name="btn-valider-bnus"
            mat-button color="primary" (click)="addCodeBonus()">
      Ajouter
    </button>
  </div>
  <div class="line">
    <mat-icon matTooltip="La photo que les autres joueurs verront">add_a_photo</mat-icon>
    <label>Photo de profil</label>
    <file-base64
      inputId="info-entite-logo"
      [allowedMimeTypes]="[ 'image/jpeg', 'image/png', 'image/gif' ]"
      [allowedExtensions]="[ 'JPEG', 'JPG', 'PNG', 'GIF' ]"
      [maxFileSize]="MAX_LOGO_SIZE"
      (fileRead)="changeLogo($event)"
      [isDisabled]="false">
    </file-base64>
  </div>

  <div class="line">
    <mat-icon matTooltip="Le nom que les autres joueurs verront">account_circle</mat-icon>
    <label>{{tokenStorage.getUser()?.pseudonyme}}</label>
    <button class="valider"
            name="btn-change"
            mat-button color="primary" (click)="changePseudo()">Changer</button>
  </div>

  <div class="line">
    <mat-icon>lock</mat-icon>
    <label>Mon mot de passe</label>
    <button class="valider"
            mat-button
            name="btn-update"
            color="primary"(click)="updatePassword()">Changer</button>
  </div>
</div>
<reseaux-sociaux [globalParams]="globalParams"></reseaux-sociaux>
<div class="option-compte">
  <button mat-button
          name="btn-delete-compte"
          color="primary"
          class="btn-delete"
          (click)="deleteCompte()">
    <mat-icon>delete_sweep</mat-icon>
    Supprimer
  </button>
  <button mat-button
          class="btn-logout"
          color="primary"
          name="btn-logout"
          matTooltip="Déconnexion"
          (click)="logout()">
    <mat-icon>power_settings_new</mat-icon>
    Déconnexion
  </button>
</div>
  `,
  styleUrls: ['./my-account-form.component.scss'],

})
export class MyAccountFormComponent implements OnInit {

  // 1Mo max par logo
  MAX_LOGO_SIZE = 5 * 1024 * 1024;
  vip = LIST_PROFIL.VIP;

  globalParams!: GlobalParams;

  constructor(private router: Router,
              private route: ActivatedRoute,
              public tokenStorage: TokenStorageService,
              private toast: ToastService,
              private userService: UserService,
              private globalParamsService: GlobalParamService,
              private popinService: PopinService) {}

  ngOnInit(): void {
    this.route.data.subscribe(
      (data: any) => this.globalParams = data.globalParam,
        (err: Error) => this.toast.genericError(err)
    );
  }

  getMessageVIP(): string {
    const days = dayDiff(dateToday(), startOfDay(this.tokenStorage.getUser()?.expiredVIPDate))
    if (this.tokenStorage.getUser()?.hasProfilAdmin() || this.tokenStorage.getUser()?.hasProfilSuperAdmin()) {
      if (days === 'NaN') {
        return `Vous êtes VIP à vie`;
      }
      return `Il vous reste ${days} jours de VIP`;
    }

    if (this.tokenStorage.getUser()?.hasVIPValid()) {
      return `Il vous reste ${days} jours de VIP`;
    }
    return `aucun abonnement VIP`;
  }

  changeLogo(event: any): void {
    let file: any;
    if (event.target.files.length > 0) {
      file = event.target.files[0];
    }
    const user: any = this.tokenStorage.getUser();
    this.popinService.showLoader();
    this.userService.saveLogo(user, file).subscribe(
      (userResp: User) => {
        this.toast.success('Votre photo de profil est enregistrée');
        this.tokenStorage.saveUser(userResp);
      },
      (err: any) => {
        this.toast.genericError(err);
        this.popinService.closeLoader();
      },
      () => this.popinService.closeLoader()
    );
  }

  get logoDataUrl(): string {
    const url = this.tokenStorage.getUser()?.logo;
    return url ? URL_STOCKAGE + url : 'assets/icons/picto-user.svg';
  }

  updatePassword(): void {
    this.popinService.openPopin(PopinChangePasswordComponent, {
      width: '400px',
      data: {password: '', confirm: ''}
    }).subscribe(data => {
      if (data.result) {
        this.popinService.showLoader(`Enregistrement en cours...`);
        this.userService.changePassword(this.tokenStorage.getUser()?.id || '', data.password).subscribe(
            () => this.toast.success(`Le nouveau mot de passe est enregistré`),
            err => this.toast.genericError(err),
          () => this.popinService.closeLoader()
          );
      }
    });
  }

  goToAbonnements(): void {
    this.router.navigate([`abonnements`]);
  }

  changePseudo(): void {
    this.popinService.openPopin(PopinPseudonymeComponent, {data: { pseudonyme: ''}}).subscribe(
      data => {
        if (data.result) {
          const user: any = this.tokenStorage.getUser();
          user.pseudonyme = data.pseudonyme || '';
          this.popinService.showLoader(`Enregistrement en cours...`);
          this.userService.update(user).subscribe(
            () => {
              this.tokenStorage.saveUser(user);
              this.toast.success(`Votre nom de joueur est enregistré`);
            },
            err => {
              if (err.error.code === 'PSEUDO_EXISTING') {
                this.toast.warning('Ce pseudonyme existe déjà');
              } else {
                this.toast.genericError(err);
              }
            },
            () => this.popinService.closeLoader()
          );
        }
    });
  }

  addCodeBonus(): void {
    this.popinService.openPopin(PopinCodePromoComponent, { data: {codePromo: ''}}).subscribe(
      data => {
        if (data.result) {
          const codePromo = data.codePromo;
          this.popinService.showLoader(`Enregistrement en cours...`);
          this.userService.addCodeVIP(this.tokenStorage.getUser()?.id || '', codePromo).subscribe(
            user => {
              this.tokenStorage.saveUser(user);
              this.toast.success(`Votre code est ajouté`);
            },
            err => {
              if (err.error.code === 'CODE_VIP_DISABLED') {
                this.toast.warning('Le code saisie et désactivé');
              } else if (err.error.code === 'CODE_VIP_NOT_FOUND') {
                this.toast.warning(`Le code saisie n'existe pas`);
              } else if (err.error.code === 'CODE_VIP_ALREADY_USED') {
                this.toast.warning('Vous avez déjà utilisé ce code');
              } else {
                this.toast.genericError(err);
              }
            },
            () => this.popinService.closeLoader()
          );
        }
      }
    );
  }

  deleteCompte(): void {
    this.popinService.openPopin(PopinConfirmComponent, {
      data: {
        description: `Voulez-vous supprimer votre compte`,
        hasBtnBack: true,
        hasTitle: true,
        title: 'Confirmation',
        hasBtnConfirm: true,
        textConfirm: 'Valider',
        textBack: 'Annuler',
      }
    }).subscribe(result => {
      if (result) {
        this.popinService.showLoader(`Enregistrement en cours...`);
        this.userService.delete(this.tokenStorage.getUser() || new User()).subscribe(
          () => {
            this.toast.success(`Votre compte est supprimé`);
            this.tokenStorage.signOut();
            this.router.navigate([`login`]);
          },
          err => this.toast.genericError(err),
          () => this.popinService.closeLoader()
        );
      }
    });
  }

  logout(): void {
    const pseudo: string = this.tokenStorage.getUser()?.pseudonyme || '';
    this.tokenStorage.signOut();
    this.router.navigate([`login`]);
  }

  changeNotif(): void {
    this.toast.warning('Fonctionnalité non disponible');

   /* this.popinService.openPopin(PopinConfirmComponent, {
      data: {
        description: `Voulez-vous ${this.tokenStorage.getUser()?.hasNotification ? 'activer' : 'désactiver'} les notifications`,
        hasBtnBack: true,
        hasTitle: true,
        title: 'Confirmation',
        hasBtnConfirm: true,
        textConfirm: 'Valider',
        textBack: 'Annuler',
      }
    }).subscribe(result => {
      if (result) {
        const user: any = this.tokenStorage.getUser();
        user.hasNotification = !this.tokenStorage.getUser()?.hasNotification;

        this.popinService.showLoader(`Enregistrement en cours...`);
        this.userService.update(user).subscribe(
          () => {
            this.tokenStorage.saveUser(user);
            this.toast.success(`Les notifications sont ${!user.hasNotification ? 'activées' : 'désactivées'}`);
          },
          err => this.toast.genericError(err),
          () => this.popinService.closeLoader()
        );
      }
    });*/  }
}
