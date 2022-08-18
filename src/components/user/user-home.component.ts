import { Component, Input } from '@angular/core';
import { Router} from '@angular/router';

import {TokenStorageService} from '../../services/token-storage.service';

import {User} from '../../models/user.model';
import {URL_STOCKAGE} from '../../utils/fetch';

@Component({
  selector:  'user-home',
  template: `
    <mat-card class="block" *ngIf="tokenStorage?.isValid()">
          <mat-card-header>
            <img mat-card-avatar [src]="logoDataUrl" class="logo-user"/>
            <mat-card-title>{{tokenStorage.getUser()?.login}}</mat-card-title>
            <mat-card-subtitle><a (click)="goToMyAccountForm()">modifier</a></mat-card-subtitle>
        </mat-card-header>
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
