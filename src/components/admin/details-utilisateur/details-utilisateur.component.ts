import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';


import {PopinChangePasswordComponent} from '../../core/popin/popin-change-password/popin-password-change.component';
import {PopinPseudonymeComponent} from '../../core/popin/popin-pseudonyme/popin-pseudonyme.component';
import {PopinCodePromoComponent} from '../../core/popin/popin-cod-promo/popin-code-promo.component';
import {PopinConfirmComponent} from '../../core/popin/popin-confirm/popin-confirm.component';

import { UserService } from '../../../services/user.service';
import {LIST_PROFIL, ARRAY_LIST_PROFIL, Profil} from '../../../models/profil.model';
import {TokenStorageService} from '../../../services/token-storage.service';
import {ToastService} from '../../../services/toast.service';
import {PopinService} from '../../../services/popin.service';

import {dateToday, dayDiff, startOfDay} from '../../../utils/date-util';

import {User} from '../../../models/user.model';


@Component({
  selector:  'details-utilisateur',
  template: `


<div class="block-larg-screen" *ngIf="user">
  <div class="block info">
    <h3>{{user.login}}</h3>

    <div class="line" *ngIf="logoDataUrl">
      <img [src]="logoDataUrl" alt="logo" class="logo"/>
    </div>

    <div class="line">
      <mat-icon [matTooltip]="user.lastConnectionDate | date:'DD-MM-YYYY hh:mm'">new_releases</mat-icon>
      <label>Dernière activité</label>
      <span class="last-connexion">{{user.lastConnectionDate | date:'DD-MM-YYYY'}}</span>
    </div>

    <div class="line">
      <mat-icon matTooltip="Pour chaque amis parrainé, recevez, vous et votre amis, 2 jours de VIP">star</mat-icon>
      <label>Code parrain</label>
      <span>{{user.codeParrain}}</span>
    </div>

    <div class="line line-slide">
      <mat-icon matTooltip="Permet de bloquer ce joueur">block</mat-icon>
      <label>Compte {{user.isEnabled ? 'activé' : 'bloqué'}}</label>
      <span class="span-slide" *ngIf="user">
        <mat-slide-toggle
          color="primary"
          [(ngModel)]="user.isEnabled"
          (change)="changeStatusUser(user)"
          [disabled]="!tokenStorage.getUser()?.hasProfilSuperAdmin()">
        </mat-slide-toggle>
      </span>
    </div>

    <div class="line">
      <mat-icon>tag_faces</mat-icon>
      <label>Compte Facebook</label>
      <span class="span-slide" *ngIf="user">
        <mat-slide-toggle
          color="primary"
          [(ngModel)]="user.isUserFB"
          disabled>
        </mat-slide-toggle>
      </span>
    </div>

    <div class="line">
      <mat-icon>{{ user.hasNotification ? 'notifications_active' : 'notifications_off' }}</mat-icon>
      <label>Notifications</label>
      <span class="span-slide" *ngIf="user">
        <mat-slide-toggle
          color="primary"
          [(ngModel)]="user.hasNotification">
        </mat-slide-toggle>
      </span>
    </div>
    <div class="line" *ngIf="tokenStorage.getUser()?.hasProfilAdmin()">
      <mat-icon matTooltip="Permet l'ajout de code promotionel">star_half</mat-icon>
      <label>Code bonus</label>
      <button class="valider"
              name="btn-add-code-vip"
              mat-button color="primary" (click)="addCodeVIP()">
        Ajouter
      </button>
    </div>

    <div class="line" *ngIf="tokenStorage.getUser()?.hasProfilAdmin()">
      <mat-icon matTooltip="La photo que les autres joueurs verront">add_a_photo</mat-icon>
      <label>Photo de profil</label>
      <file-base64
        inputId="info-entite-logo"
        [allowedMimeTypes]="[ 'image/jpeg', 'image/png', 'image/gif' ]"
        [allowedExtensions]="[ 'JPEG', 'JPG', 'PNG', 'GIF' ]"
        [maxFileSize]="MAX_LOGO_SIZE"
        (onFileRead)="changeLogo($event)">
      </file-base64>
    </div>

    <div class="line" *ngIf="tokenStorage.getUser()?.hasProfilAdmin()">
      <mat-icon matTooltip="Le nom que les autres joueurs verront">account_circle</mat-icon>
      <label>{{user.pseudonyme}}</label>
      <button class="valider"
              mat-button
              name="btn-change-speudo"
              color="primary" (click)="changePseudo()"
              [disabled]="!tokenStorage.getUser()?.hasProfilSuperAdmin()">
        Changer
      </button>
    </div>

    <div class="line" *ngIf="tokenStorage.getUser()?.hasProfilAdmin()">
      <mat-icon>lock</mat-icon>
      <label>Mon mot de passe</label>
      <button class="valider"
              name="btn-update-password"
              mat-button
              color="primary"
              (click)="updatePassword()"
              [disabled]="!tokenStorage.getUser()?.hasProfilSuperAdmin()">
        Changer
      </button>
    </div>
  </div>
  <div class="col-2">
    <div class="block info-vip">
      <h3>Information(s) VIP</h3>
      <div class="blcok-vip" *ngIf="user.hasProfilVIP()">
        <img class="picto-vip" [src]="vip.img" [alt]="vip.code"/>
        <label class="message-vip">{{getMessageVIP()}}</label>
        <span class="expire-vip-label" *ngIf="user.expiredVIPDate">Expire le {{user.expiredVIPDate | date:'DD JANVIER YYYY à hh:mm'}}</span>
        <button mat-button color="primary"
                name="btn-change-date-exp"
                *ngIf="tokenStorage.getUser()?.hasProfilSuperAdmin() && user?.expiredVIPDate"
                (click)="showChangeExpiredVIPDate = !showChangeExpiredVIPDate">
          Changer la date d'expiration
        </button>
        <div class="form-new-expired-date-vip" *ngIf="showChangeExpiredVIPDate">
          <mat-form-field>
            <input matInput
                   [matDatepicker]="dateDebutPicker"
                   placeholder="Date de fin VIP'"
                   readonly
                   required
                   #debutDate="ngModel"
                   (focus)="dateDebutPicker.open()"
                   [(ngModel)]="newDateExpiredVIP"
                   name="dateDebutPicker">
            <mat-datepicker-toggle matSuffix [for]="dateDebutPicker" color="accent"></mat-datepicker-toggle>
            <mat-datepicker #dateDebutPicker color="accent"></mat-datepicker>
          </mat-form-field>
          <button class="valider"
                  mat-button
                  color="primary"
                  name="btn-change-exp-date"
                  (click)="onChangeExpiredVIPDate()">
            Changer
          </button>
        </div>
      </div>
    </div>
    <div class="block code-bonus">
      <h3>Code(s) Bonus utilisé(s)</h3>
      <ng-container *ngIf="user.codesVIP">
        <div *ngFor="let codeVIP of user.codesVIP">
          <span>{{codeVIP.titre}} <strong> | </strong> {{codeVIP.code}}  <strong> | </strong> {{codeVIP.nbJoursVIP}}</span>
        </div>
        <button mat-button
                color="primary"
                name="btn-add-code-vip"
                (click)="addCodeVIP()">
          Ajouter un Code Bonus
        </button>
      </ng-container>
      <p class="no-result" *ngIf="!user.codesVIP">Aucun Code Bonus</p>
    </div>
  <div class="block profils" *ngIf="tokenStorage.getUser()?.hasProfilSuperAdmin()">
    <h3>Profils</h3>
      <ul>
        <li *ngFor="let profil of listProfils">
          <mat-checkbox [checked]="user.profils.includes(profil)"
                        (click)="addProfilSelected(profil)"
                        name="profils">
            {{profil.label}}
          </mat-checkbox>
        </li>
      </ul>
    <button
      mat-button
      color="primary"
      name="btn-pronostiqueur"
      (click)="changeProfilForUser()">
      Enregistrer
    </button>
  </div>
  <div class="block delete-compte" *ngIf="tokenStorage.getUser()?.hasProfilSuperAdmin()">
    <button mat-button
            name="btn-delete-compte"
            color="primary"
            (click)="deleteCompte()">
      Supprimer ce compte
    </button>
  </div>
  </div>
  <div class="action">
      <button mat-stroked-button
              color="warn"
              class="retour"
              name="btn-go-to-gestion"
              (click)="goToGestionUser()"
              type="button">
          Retour
      </button>
  </div>
</div>

  `,
  styleUrls: ['./details-utilisateur.component.scss'],

})
export class DetailsUtilisateurComponent implements OnInit {

  user!: User;
  listProfils = ARRAY_LIST_PROFIL;

  // 1Mo max par logo
  MAX_LOGO_SIZE = 5 * 1024 * 1024;
  vip = LIST_PROFIL.VIP;

  showChangeExpiredVIPDate: boolean = false;
  newDateExpiredVIP!: Date;

  listProfilsSelected: Set<string> = new Set();

  constructor(private router: Router,
              private toast: ToastService,
              private popinService: PopinService,
              private route: ActivatedRoute,
              private userService: UserService,
              public tokenStorage: TokenStorageService) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.onParamsChange(params);
    });
  }

  onParamsChange(params: any): void {
    if (params.id) {
      this.popinService.showLoader();
      this.userService.getById(params.id).subscribe(
        user => {
          this.user = user;
          this.newDateExpiredVIP = this.user.expiredVIPDate ? this.user.expiredVIPDate : new Date();
          this.listProfilsSelected = new Set(this.user.profils.map(profil => profil.code));
        },
        err => this.toast.genericError(err),
        () => this.popinService.closeLoader()
      );
    }
  }

  getMessageVIP(): string {
    if (this.user.hasVIPValid()) {
      return `Il reste ${dayDiff(dateToday() , startOfDay( this.user.expiredVIPDate))} jour(s) de VIP`;
    }
    return `aucun abonnement VIP`;
  }

  goToGestionUser(): void {
    this.router.navigate(['administration', `utilisateurs`]);
  }

  onChangeExpiredVIPDate(): void {
    this.user.expiredVIPDate = this.newDateExpiredVIP;
    this.saveUser('La date d\'expiration est mise à jour');
  }

  saveUser(messageSuccess: string): void {
      this.popinService.showLoader(`Enregistrement en cours...`);
      this.userService.update(this.user, true).subscribe(
        () => this.toast.success(messageSuccess),
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

  changeStatusUser(user: User): void {
    this.popinService.openPopin(PopinConfirmComponent, {
      data: {
        description: `Voulez-vous ${user.isEnabled ? 'activer' : 'bloquer'} ce compte ?`,
        hasBtnBack: true,
        hasTitle: true,
        title: 'Confirmation',
        hasBtnConfirm: true,
        textConfirm: 'Valider',
        textBack: 'Annuler',
      }
    }).subscribe(result => {
      if (result) {
        this.saveUser(`Ce compte est ${user.isEnabled ? 'activé' : 'bloqué'}`);
      } else {
        user.isEnabled = !user.isEnabled;
      }
    });
  }

  changeLogo(file: any): void {
    this.user.logoFileType = file.mimetype.substring(file.mimetype.indexOf('/') + 1);
    this.user.logo = file.dataUrl.substring(file.dataUrl.indexOf(',') + 1);
    this.saveUser('La photo de profil est enregistrée');
  }

  get logoDataUrl(): string {
    if (this.user.logo){
      return this.user.logo;
    }
    return 'assets/icons/picto-user.svg';
  }

  updatePassword(): void {
    this.popinService.openPopin(PopinChangePasswordComponent, {
      width: '400px',
      data: {password: '', confirm: ''}
    }).subscribe(data => {
      if (data.result) {
          this.popinService.showLoader(`Enregistrement des données en cours...`);
          this.userService.changePassword(this.user.id, data.password, true).subscribe(
            () => this.toast.success(`Le nouveau mot de passe est enregistré`),
            err => this.toast.genericError(err),
            () => this.popinService.closeLoader());
      }
    });
  }

  goToAbonnements(): void {
    this.router.navigate([`abonnements`]);
  }

  changePseudo(): void {
    this.popinService.openPopin(PopinPseudonymeComponent, {
      width: '400px',
      data: { pseudonyme: ''}
    }).subscribe(data => {
      if (data.result) {
        this.popinService.showLoader(`Enregistrement des données en cours...`);

        this.userService.update(this.user, true).subscribe(
          () => {
            this.user.pseudonyme = data.pseudonyme;
            this.toast.success('Le nom de joueur est à jour');
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

  addCodeVIP(): void {
    this.popinService.openPopin(PopinCodePromoComponent, {
      width: '400px',
      data: {codePromo: ''}
    }).subscribe(data => {
      if (data.result) {
        this.popinService.showLoader(`Enregistrement des données en cours...`);

        const codePromo = data.codePromo;
        this.userService.addCodeVIP(this.user.id, codePromo, true).subscribe(
          user => {
            this.user = user;
            this.listProfilsSelected = new Set(this.user.profils.map(profil => profil.code));
            this.toast.success(`Votre code est ajouté (Fake)`);
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
    });
  }

  deleteCompte(): void {
    this.popinService.openPopin(PopinConfirmComponent, {
      data: {
        description: `Voulez-vous supprimer ce compte`,
        hasBtnBack: true,
        hasTitle: true,
        title: 'Confirmation',
        hasBtnConfirm: true,
        textConfirm: 'Valider',
        textBack: 'Annuler',
      }
    }).subscribe(result => {
      if (result) {
        this.popinService.showLoader('Suppression en cours...');
        this.userService.delete(this.user).subscribe(
            () => {
              this.toast.success(`Ce compte est supprimé`);
              this.router.navigate(['administration', `utilisateurs`]);
            },
            err => this.toast.genericError(err),
            () => this.popinService.closeLoader()
          );
      }
    });
  }

  changeProfilForUser(): void {
    if (this.tokenStorage.getUser()?.hasProfilSuperAdmin()) {
      this.popinService.showLoader(`Enregistrement en cours...`);
      this.userService.changeProfilUser(this.user, this.listProfilsSelected).subscribe(
        user => {
          this.user = user;
          this.listProfilsSelected = new Set(this.user.profils.map(profil => profil.code));
          this.toast.success(`Les profils de l'utilisateur sont à jour`);
        },
        err => {
          if (err.error.code === 'PROFILS_NOT_FOUND') {
            this.toast.warning(`L'utilisateur doit avoir minimun un profil`);
          } else {
            this.toast.genericError(err);
          }
        },
        () => this.popinService.closeLoader()
      );
    }
  }

  addProfilSelected(profil: Profil): void {
    this.listProfilsSelected.has(profil.code) ? this.listProfilsSelected.delete(profil.code) : this.listProfilsSelected.add(profil.code);
  }
}
