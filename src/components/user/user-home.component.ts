import { Component, Input } from '@angular/core';
import { Router} from '@angular/router';

import {TokenStorageService} from '../../services/token-storage.service';

import {User} from '../../models/user.model';
import {URL_STOCKAGE} from '../../utils/fetch';

@Component({
  selector:  'user-home',
  template: `
    <mat-card class="block bg-dark d-flex flex-row me-0 shadow align-items-center align-content-center"
              *ngIf="tokenStorage?.isValid()">
      <img mat-card-avatar [src]="logoDataUrl" class="me-2 p-0 logo"/>
      <div class="d-flex flex-column ms-2 overflow-hidden">
        <div class="text-primary fs-5 login">{{tokenStorage.getUser()?.login}}</div>
        <a (click)="goToMyAccountForm()">modifier</a>
      </div>
    </mat-card>`,
  styleUrls: ['./user-home.component.scss']
})
export class UserHomeComponent {

  @Input() user!: User;

  constructor(private router: Router, public tokenStorage: TokenStorageService) {}

  goToMyAccountForm(): void {
    this.router.navigate([`account`]);
  }

  get logoDataUrl(): string {
    const url = this.tokenStorage.getUser()?.logo;
    return url ? URL_STOCKAGE + url : 'assets/icons/picto-user.svg';
  }
}
