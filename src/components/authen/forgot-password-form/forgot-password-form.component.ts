import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

import {ToastService} from '../../../services/toast.service';

import {validateForm, VALIDATION_ERROR} from '../../../utils/validation';
import { PATTERN_EMAIL } from '../../../utils/regexp';

import { UserService} from '../../../services/user.service';

import {User} from '../../../models/user.model';

@Component({
  selector:  'app-forgot-password-form',
  template: `

    <div class="bloc-password-form">
      <img src="assets/icons/logo_accueil.png" class="logo-accueil" alt="logo"/>
      <p class="description-auth">Indiquez ci-dessous l'adresse email que vous utilisez pour vous connecter à votre compte.
        Vous recevrez un email vous indiquant la marche à suivre pour récupérer l’accès à votre compte.
      </p>
      <form autocomplete="off" class="forgot-password-form hide-validation-errors" (submit)="isFormValid() && submit()">
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
        <button
          mat-raised-button
          name="btn-valider"
          color="accent" type="submit">Valider</button>
      </form>
      <div class="action-link">
        <a [routerLink]="['../']">
          <mat-icon>keyboard_arrow_left</mat-icon>
          Se connecter
        </a>
      </div>
    </div>
  `,
  styleUrls: ['./forgot-password-form.component.scss'],

})
export class ForgotPasswordFormComponent implements  OnInit {

  PATTERN_EMAIL = PATTERN_EMAIL;
  user!: User;

  constructor(private toast: ToastService,
              private router: Router,
              public dialog: MatDialog,
              private  userService: UserService) {
  }

  ngOnInit(): void {
    this.user = new User();
  }

  submit(): void {
    this.toast.success('Un email vous a été envoyé avec votre nouveau mot de passe');

   /* this.userService.forgotPassword(this.user.login).subscribe(
      () => {
        this.toast.success('Un email vous a été envoyé avec votre nouveau mot de passe');
        this.router.navigate([`login`], { queryParams: { login: this.user.login }});
      },
      err => this.toast.genericError(err)
    );*/
  }

  isFormValid(): boolean {
    const result = validateForm({ selector: '.forgot-password-form'});
    if (!result) {
      this.toast.error(VALIDATION_ERROR);
    }
    return result;
  }
}
