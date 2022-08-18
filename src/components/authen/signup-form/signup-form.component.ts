import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

import {ToastService} from '../../../services/toast.service';
import {PopinService} from '../../../services/popin.service';
import { UserService} from '../../../services/user.service';
import {AuthUserService} from '../../../services/auth-user.service';

import {User} from '../../../models/user.model';

import {validateForm, VALIDATION_ERROR} from '../../../utils/validation';
import { PATTERN_EMAIL } from '../../../utils/regexp';

@Component({
  selector:  'app-signup-form',
  template: `
    <img src="assets/icons/logo_accueil.png" class="logo-accueil" alt="logo"/>
    <div class="block">
      <!--<h2>Rejoignez nous</h2>-->
      <p class="description-auth">Dans quelques instants vous pourrez naviger sur la communauté de King Pronos, il suffit de remplir ce formulaire.</p>
      <form autocomplete="off"
            class="signup-form hide-validation-errors"
            (submit)="isFormValid() && submit()">

        <mat-form-field>
          <input matInput
                 placeholder="Nom de joueur"
                 [(ngModel)]="user.pseudonyme"
                 name="pseudonyme"
                 required
                 #pseudonyme="ngModel"
                 maxlength="50"
                 minlength="5">
          <button mat-icon-button
                  matSuffix
                  name="btn-account"
                  tabindex="-1"
                  type="button"
                  matTooltip="Le nom que les autres joueurs verront">
            <mat-icon color="accent">account_circle</mat-icon>
          </button>
          <p class="error required" *ngIf="pseudonyme?.errors?.['required']">Veuillez choisir un nom de joueur</p>
          <p class="error format" *ngIf="pseudonyme?.errors?.['minlength']">Le nom de joueur est trop court</p>
          <p class="error format" *ngIf="pseudonyme?.errors?.['maxlength']">Le nom de joueur est trop long</p>
        </mat-form-field>

        <mat-form-field>
          <input matInput
                 placeholder="Email"
                 [(ngModel)]="user.login"
                 name="login"
                 required
                 #login="ngModel"
                 [pattern]="PATTERN_EMAIL"
                 maxlength="50"
                 minlength="3">
          <button mat-icon-button
                  matTooltip="vous@exemple.com"
                  matSuffix
                  name="btn-email"
                  tabindex="-1"
                  type="button">
            <mat-icon color="accent">email</mat-icon>
          </button>
          <p class="error required" *ngIf="login.errors?.['required']">Veuillez saisir une adresse email</p>
          <p class="error format" *ngIf="login.errors?.['pattern']">Veuillez saisir une adresse email valide</p>
        </mat-form-field>

        <mat-form-field>
          <input matInput
                 placeholder="Mot de passe"
                 [(ngModel)]="user.password"
                 required
                 name="password"
                 autocomplete="on"
                 #password="ngModel"
                 maxlength="30"
                 minlength="8"
                 [type]="hidePwd ? 'password' : 'text'">
          <button mat-icon-button
                  type="button"
                  name="btn-hide-pass"
                  matTooltip="Le mot de passe doit contenir 8 caractères minimum"
                  matSuffix (click)="hidePwd = !hidePwd"
                  tabindex="-1"
                  [attr.aria-pressed]="hidePwd">
            <mat-icon color="accent">{{hidePwd ? 'visibility_off' : 'visibility'}}</mat-icon>
          </button>
          <p class="error required" *ngIf="password.errors?.['required']">Veuillez saisir un mot de passe</p>
          <p class="error format" *ngIf="password.errors?.['minlength']">Ce mot de passe est trop court</p>
          <p class="error format" *ngIf="password.errors?.['maxlength']">Ce mot de passe est trop long</p>
        </mat-form-field>

        <mat-form-field>
          <input matInput
                 name="passwordConfirm"
                 placeholder="Confirmer le mot de passe"
                 [type]="hidePwdConfirm ? 'password' : 'text'"
                 [(ngModel)]="user.passwordConfirm"
                 #passwordConfirm="ngModel"
                 autocomplete="on"
                 maxlength="30"
                 minlength="8"
                 required>
          <button mat-icon-button
                  matSuffix
                  name="hide-password"
                  tabindex="-1"
                  color="accent"
                  matTooltip="Le mot de passe doit contenir 8 caractères minimum"
                  (click)="hidePwdConfirm = !hidePwdConfirm"
                  [attr.aria-label]="'Hide password'"
                  type="button"
                  [attr.aria-pressed]="hidePwdConfirm">
            <mat-icon>{{hidePwdConfirm ? 'visibility_off' : 'visibility'}}</mat-icon>
          </button>
          <p class="error required" *ngIf="passwordConfirm.errors?.['required']">Veuillez saisir un mot de passe</p>
          <p class="error format" *ngIf="passwordConfirm.errors?.['minlength']">Ce mot de passe est trop court</p>
          <p class="error format" *ngIf="passwordConfirm.errors?.['maxlength']">Ce mot de passe est trop long</p>
          <p class="error format" *ngIf="!user.isSamePassword()
                                          && !passwordConfirm.errors?.['minlength']
                                          && !passwordConfirm.errors?.['required']">
            les deux mots de passe sont différents
          </p>

        </mat-form-field>
        <button mat-flat-button
                color="accent"
                name="valider"
                type="submit">
          Valider
        </button>
      </form>
      <div class="action-link">
        <a [routerLink]="['../login']" class="link-login">
          Se connecter
          <mat-icon>keyboard_arrow_right</mat-icon>
        </a>
      </div>
    </div>
  `,
  styleUrls: ['./signup-form.component.scss'],

})
export class SignupFormComponent  implements OnInit {

  user!: User;
  PATTERN_EMAIL = PATTERN_EMAIL;

  hidePwd: boolean = true;
  hidePwdConfirm: boolean = true;

  constructor(private toast: ToastService,
              private router: Router,
              private popinService: PopinService,
              private  userService: UserService,
              private authService: AuthUserService) {}

  ngOnInit(): void {
   this.user = new User();
  }

  isFormValid(): boolean {
    const result = validateForm({ selector: '.signup-form'});
    if (!result) {
      this.toast.error(VALIDATION_ERROR);
    }
    return result;
  }

  submit(): void {

     if (this.user.password !== this.user.passwordConfirm) {
       this.toast.error('Les mot de passe ne correspondent pas');
       return;
     }
     this.popinService.showLoader(`Enregistrement en cours...`);
     this.authService.signup(this.user).subscribe(
      () => {
        this.toast.success('Votre compte est créé');
        this.router.navigate([`login`], { queryParams: { login: this.user.login }});
      },
      err => {
        if (err.error.code === 'EMAIL_EXISTING') {
          this.toast.warning('Cette adresse mail existe déjà');
        } else if (err.error.code === 'PSEUDO_EXISTING') {
          this.toast.warning('Ce nom de joueur existe déjà');
        } else {
          this.toast.genericError(err);
        }
      },
      () => this.popinService.closeLoader()
    );
  }
}
