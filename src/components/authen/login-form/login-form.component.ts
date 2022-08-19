import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';

import {ToastService} from '../../../services/toast.service';
import {UserService} from '../../../services/user.service';
import {AuthUserService} from '../../../services/auth-user.service';
import {TokenStorageService} from '../../../services/token-storage.service';

import {User} from '../../../models/user.model';
import {PopinService} from '../../../services/popin.service';

@Component({
  selector:  'app-login-form',
  template: `

    <img src="assets/icons/logo_accueil.png"  class="logo-accueil" alt="logo"/>
    <p class="description-auth px-2">Application de pronostics sportifs spécialisée dans le tennis, le football et le basketball</p>
    <div class="bloc-login-form">
      <form [formGroup]="loginForm" autocomplete="off" novalidate (ngSubmit)="submit(loginForm.value)">
        <mat-form-field>
          <input matInput placeholder="Email" formControlName="email" required>
          <button
            mat-icon-button
            matSuffix
            type="button"
            name="icon-mail"
            tabindex="-1">
              <mat-icon color="accent">email</mat-icon>
          </button>
          <mat-error *ngIf="hasError('email', 'required')">Veuillez saisir une adresse mail</mat-error>
          <mat-error *ngIf="hasError('email', 'email')">Veuillez saisir une adresse mail valide</mat-error>
        </mat-form-field>
        <mat-form-field>

          <input matInput
                 placeholder="Mot de passe"
                 [type]="hide ? 'password' : 'text'"
                 formControlName="password"
                 name="password"
                 autocomplete="on"
                 required>
          <button mat-icon-button
                  matSuffix
                  (click)="hide = !hide"
                  name="hide-password"
                  type="button"
                  tabindex="-1"
                  [attr.aria-label]="'Hide password'"
                  [attr.aria-pressed]="hide">
            <mat-icon color="accent">
                {{hide ? 'visibility_off' : 'visibility'}}
            </mat-icon>
          </button>
          <mat-error *ngIf="hasError('password', 'required')">Veuillez saisir un mot de passe</mat-error>
        </mat-form-field>
        <button
          mat-raised-button
          name="btn-valider"
          color="accent" type="submit">
          Connexion
        </button>
      </form>
      <div class="action-link">
        <a [routerLink]="['/signup']">
            <mat-icon>keyboard_arrow_left</mat-icon>
            Inscription
        </a>
       <a [routerLink]="['/forgot-password']" class="link-forgot-password">
           Mot de passe oublié
           <mat-icon>keyboard_arrow_right</mat-icon>
       </a>
      </div>
      <!-- <div class="link-fb">
         <button
           name="btn-fb-login-form"
           class="btn-fb-login"
           type="button"
           (click)="signInWithFB()"
           mat-flat-button
           color="primary">
           Connexion avec Facebook
         </button>
       </div> -->
          <div class="version"><label>V 3.0.3</label></div>
        </div>
`,
  styleUrls: ['./login-form.component.scss'],

})
export class LoginFormComponent implements OnInit {

  loginForm!: FormGroup;
  hide = true;
  error!: string;

  constructor(private router: Router,
              private toast: ToastService,
              private popinService: PopinService,
              private route: ActivatedRoute,
         //     private authSocialService: SocialAuthService,
              private userService: UserService,
              private tokenStorage: TokenStorageService,
              private authService: AuthUserService) {}

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required])
    });

    this.route.queryParams.subscribe(params => {
      this.init(params);
    });
  }

  signInWithFB(): void {
   /* this.authSocialService.signIn(FacebookLoginProvider.PROVIDER_ID).then(() => {
    this.authSocialService.authState.subscribe(
      (userFB: any) => {
        if (userFB) {
          this.popinService.showLoader('Connexion via FB en cours...');
          this.authService.loginFB(userFB).subscribe(
            data => {
              this.toast.success(`Bienvenue ${data.user.pseudonyme}`);
              this.tokenStorage.saveToken(data.token);
              this.tokenStorage.saveUser(new User(data.user));
              this.router.navigateByUrl('home');
            },
            err => {
              if (err.error.code === 'BAD_CREDENTIALS') {
                this.toast.error('Identifiant ou mot de passe invalide.');
              } else if (err.error.code === 'USER_FB_AUTHENTICATE') {
                this.toast.warning('Cette adresse mail est utilisée dans le cadre d\'une connexion via Facebook.');
              } else {
                this.toast.genericError(err);
              }
              this.tokenStorage.signOut();
            },
            () => {
            //  this.authSocialService.signOut();
              this.popinService.closeLoader();
            }
          );
        }
      },
      (err: any) => console.error(err)
    );
    });*/
  }

  signOut(): void {
    //this.authSocialService.signOut();
  }

  init(params: any = {}): void {
    this.loginForm = new FormGroup({
      email: new FormControl((params.login || ''), [Validators.required, Validators.email]),
      password: new FormControl(params.password || '', [Validators.required])
    });
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.loginForm.controls[controlName].hasError(errorName);
  }

  submit(value: any): void {
    if (!this.loginForm.valid) {
      this.toast.warning('La saisie est invalide');
      return;
    }
    const val = { email: value.email.trim(), password: value.password };
    this.popinService.showLoader('Connexion en cours...');
    this.authService.login(val).subscribe(
      data => {
        this.toast.success(`Bienvenue ${data.user.pseudonyme}`);
        this.tokenStorage.saveToken(data.token);
        this.tokenStorage.saveUser(new User(data.user));
        this.router.navigateByUrl('home');
      },
      err => {
        if (err.error.code === 'BAD_CREDENTIALS'){
          this.toast.error('Identifiant ou mot de passe invalide.');
        } else if (err.error.code === 'DISABLED_ACCOUNT') {
          this.toast.error('Votre compte est bloqué. Veuillez contacter un administrateur.');
        } else {
          this.toast.genericError(err);
        }
        this.tokenStorage.signOut();
        this.popinService.closeLoader();
      },
      () => this.popinService.closeLoader()
    );
  }
}

