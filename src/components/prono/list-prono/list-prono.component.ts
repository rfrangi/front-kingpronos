import { Component, Input, Output, EventEmitter} from '@angular/core';
import { Router } from '@angular/router';

import { PronosticsService } from '../../../services/pronostic.service';
import {TokenStorageService} from '../../../services/token-storage.service';

import {ToastService} from '../../../services/toast.service';
import {PopinCalculMiseComponent} from '../../core/popin/popin-calcul-mise/popin-calcul-mise.component';
import { PopinUpdatePronosticComponent } from '../../core/popin/popin-update-pronostic/popin-update-pronostic.component';
import { FADE_IN_GROW } from '../../../services/animations.service';
import {PopinService} from '../../../services/popin.service';

import { PRIVACYS } from '../../../models/pronostic-privacy.model';
import {PRONO_STATUS } from '../../../models/pronostic-status.model';
import { Pronostic } from '../../../models/pronostic.model';
import {URL_STOCKAGE} from '../../../utils/fetch';

@Component({
  selector: 'list-prono',
  styleUrls: ['./list-prono.component.scss'],
  animations: FADE_IN_GROW,
  template: `
<mat-card class="block"
          [class.chat]="pageChat"
          *ngFor="let prono of pronostics" @fadeInGrow>
  <ng-container *ngIf="prono.privacy === LIST_PRIVACYS.PUBLIC
  || (prono.privacy === LIST_PRIVACYS.PRIVE && tokenStorage.getUser()?.hasVIPValid())
  || isAdmin">
  <div class="header-pronostic">
    <div class="block-cat-date">
      <ng-container *ngFor="let cat of prono.getCategories()">
          <img class="img-cat" [src]="cat.img" [alt]="cat.label"/>
      </ng-container>
      <span class="date-debut" *ngIf="prono.creationDate">{{prono?.creationDate  | date:'DD JANVIER YYYY'}} </span>
      <span class="privacy-prono" *ngIf="tokenStorage.getUser()?.hasProfilAdmin() && isAdmin"> - {{prono.privacy.label}}</span>
      <span class="privacy-prono" *ngIf="prono.fun"> - Pronostic Fun</span>
    </div>
    <div class="btn-action-header">
      <button
        *ngIf="isAdmin && (prono.status === LIST_STATUS.IN_PROGRESS || tokenStorage.getUser()?.hasProfilSuperAdmin())"
            mat-icon-button
            name="btn-menu"
            [matMenuTriggerFor]="menu">
        <span *ngIf="prono.matchs.length > 0 && isAdmin && prono.status === LIST_STATUS.IN_PROGRESS">{{ prono.status.label}}</span>
        <mat-icon color="primary">more_vert</mat-icon>
      </button>
      <mat-menu #menu="matMenu">
        <button mat-menu-item
                name="btn-update"
                (click)="goToUpdate(prono)"
                *ngIf="prono.status === LIST_STATUS.IN_PROGRESS || tokenStorage.getUser()?.hasProfilSuperAdmin()">
          <mat-icon color="primary">build</mat-icon>
          <span>Modifier</span>
        </button>
        <button mat-menu-item
                name="btn-update-status"
                (click)="showPopinUpdateProno(prono)"
                *ngIf="(prono.status === LIST_STATUS.IN_PROGRESS && prono.matchs.length > 0 && tokenStorage.getUser()?.hasProfilAdmin())">
          <mat-icon color="primary">check</mat-icon>
          <span>Valider</span>
        </button>
        <button mat-menu-item
                name="btn-delete"
                (click)="deleteprono(prono.id)"
                *ngIf="tokenStorage.getUser()?.hasProfilSuperAdmin()">
          <mat-icon  color="primary">cancel_presentation</mat-icon>
          <span>Supprimer</span>
        </button>
      </mat-menu>
    </div>
  </div>
  <mat-card-content>
    <ng-container *ngFor="let match of prono.matchs">
      <details-match [match]="match" [pronoStatus]="prono.status"></details-match>
    </ng-container>
    <div class="details-gain"  *ngIf="prono.matchs.length > 0">
      <span class="mise">
        Mise:
        <strong>{{prono.mise}}%</strong>,
      </span>
      <span class="coteTotal">
        Cote:
        <strong>{{prono.coteTotal || prono.calculCoteTotal}}</strong>,
      </span>
      <span>
        {{ prono.getLabelGain()}}
        <strong *ngIf="prono.status != LIST_STATUS.CANCEL">{{prono.gain}} €</strong>
      </span>
    </div>
    <p class="prono-description" *ngIf="tokenStorage.getUser()?.hasVIPValid()">
        {{prono?.description}}
    </p>
    <div class="div-image">
        <img class="image-prono" *ngIf="prono.urlImage" [src]="getUrl(prono)" alt="image-prono">
    </div>
    <button mat-button
            *ngIf="prono.matchs.length > 0 && !isAdmin && prono.status == LIST_STATUS.IN_PROGRESS && !pageChat"
            (click)="goToPopinCalculMise(prono)"
            class="valider"
            name="btn-valider"
            color="primary"
            type="button">
      Calculer ma mise
    </button>
  </mat-card-content>
  <mat-card-actions [class.center]="isAdmin" *ngIf="tokenStorage.getUser()?.hasProfilSuperAdmin()">
    <!--<button *ngIf="!isAdmin && !pageChat" mat-button (click)="goToCommentaires(prono)">COMMENTAIRES</button>-->
  </mat-card-actions>
  </ng-container>
  <ng-container *ngIf="(prono.privacy === LIST_PRIVACYS.PRIVE && !tokenStorage.getUser()?.hasVIPValid()) && !isAdmin">
    <div class="no-vip">
      <span class="title">{{prono?.creationDate  | date:'DD JANVIER YYYY'}}</span>
      <mat-icon>lock</mat-icon>
      <span class="title-prono-cache">Pronostic caché</span>
      Pour avoir accès à ce pronostic, vous devez être un membre VIP
      <button mat-button
              name="btn-add-vip"
              class="btn-add-vip" color="primary"
              (click)="goToAbonnements()">
        Devenir VIP
      </button>
    </div>
  </ng-container>
</mat-card>
  `,
})
export class ListPronoComponent {

  @Input() pronostics: Array<Pronostic> = [];
  @Input() isAdmin: boolean | undefined = false;
  @Input() pageChat: boolean | undefined = false;

  @Output() changeListProno = new EventEmitter();

  LIST_PRIVACYS = PRIVACYS;
  LIST_STATUS = PRONO_STATUS;

  constructor(private router: Router,
              private pronosticService: PronosticsService,
              private popinService: PopinService,
              private toast: ToastService,
              public tokenStorage: TokenStorageService) {
  }

  goToAbonnements(): void {
    this.router.navigate([`abonnements`]);
  }

  goToUpdate(prono: Pronostic): void {
    this.router.navigate(['administration', `pronostics`, prono.id]);
  }

  likeProno(prono: Pronostic): void {
    if (!this?.tokenStorage.getUser()?.hasVIPValid()) {
      this.toast.warning('Il faut être menbre VIP pour liker ce pronostic');
      return;
    }
    this.popinService.showLoader();
    this.pronosticService.likeProno(prono.id).subscribe(
      () => {},
      err => this.toast.genericError(err),
      () => this.popinService.closeLoader()
    );
  }

  getUrl(prono: Pronostic): string {
    return URL_STOCKAGE + prono.urlImage;
  }

  goToCommentaires(prono: Pronostic): void {
    if (!this.tokenStorage.getUser()?.hasVIPValid()) {
      this.toast.warning('Il faut être menbre VIP pour accèder aux commentaires');
      return;
    }
    this.router.navigate(['chat', `pronostic`, prono.id]);
  }

  goToPopinCalculMise(prono: Pronostic): void {
    this.popinService.openPopin(PopinCalculMiseComponent, {
      width: '400px',
      data: {
        mise: prono.mise,
        cote: prono.calculCoteTotal
      }
    });
  }

  showPopinUpdateProno(prono: Pronostic): void {
    this.popinService.openPopin(PopinUpdatePronosticComponent, {data: { pronostic: prono }}).subscribe(
      data => {
        if (data.result) {
          this.popinService.showLoader();
          this.pronosticService.update(data.pronostic, null).subscribe(
            () => this.toast.success(`Le pronostic est ${data.pronostic.status.label}`),
            err => this.toast.genericError(err),
            () => this.popinService.closeLoader()
          );
        }
    });
  }

  deleteprono(id: string): void {
    this.popinService.showLoader();
    this.pronosticService.remove(id).subscribe(
      () => {
        this.toast.success(`Le pronostic est supprimé`);
        this.changeListProno.emit();
      },
      err => this.toast.genericError(err),
      () => this.popinService.closeLoader()
    );
  }
}
