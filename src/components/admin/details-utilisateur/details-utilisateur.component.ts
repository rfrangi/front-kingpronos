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
  templateUrl: './details-utilisateur.component.html',
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
