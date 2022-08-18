import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MediaMatcher } from '@angular/cdk/layout';

import {ToastService} from '../../../services/toast.service';
import {PopinConfirmComponent} from '../../core/popin/popin-confirm/popin-confirm.component';
import {PopinCrudCodeVipComponent} from '../../core/popin/popin-crud-code-vip/popin-crud-code-vip.component';

import {PaginationService} from '../../../services/pagination.service';
import { CodeVIPService} from '../../../services/code-vip.service';
import {SortingService} from '../../../services/sorting.service';
import {TokenStorageService} from '../../../services/token-storage.service';

import { CodeVIP } from '../../../models/code-vip.model';

@Component({
  selector:  'gestion-code-vip',
  template: `
<div class="block ajouter">
  <mat-form-field>
    <input matInput placeholder="Tapez un mot clé"  name="input-search" [(ngModel)]="searchTerm">
  </mat-form-field>
  <button mat-raised-button
          class="btn-action btn-search"
          type="submit"
          name="btn-search"
          matTooltip="Rechercher"
          color="primary"
          (click)="search()">
    <mat-icon>search</mat-icon>
  </button>
  <button mat-raised-button
          color="primary"
          name="btn-valider"
          matTooltip="Ajouter un code VIP"
          type="submit"
          class="btn-action valider"
          (click)="addCodeVIP(null)">
    <mat-icon>playlist_add</mat-icon>
  </button>
</div>

  <table class="tableau">
    <thead>
    <tr>
      <th *ngIf="tokenStorage.getUser()?.hasProfilSuperAdmin()">ID</th>
      <th *ngIf="!mobileQuery.matches">Titre</th>
      <th>Code</th>
      <th>Activé</th>
      <th>Jrs</th>
      <th class="th-action"></th>
    </tr>
    </thead>
    <tbody>
    <tr class="details-prono" *ngFor="let code of codes">
      <td *ngIf="tokenStorage.getUser()?.hasProfilSuperAdmin()">{{code?.codeId}}</td>
      <td *ngIf="!mobileQuery.matches">{{code?.titre}}</td>
      <td><span>{{code?.code}}</span></td>
      <td>
        <span class="span-slide">
          <mat-slide-toggle
            color="primary"
            [(ngModel)]="code.isEnabled"
            (change)="changeStatusCode(code)">
        </mat-slide-toggle>
        </span>
      </td>
      <td>{{ code?.nbJoursVIP }}</td>
      <td>
        <button mat-button
                color="primary"
                name="btn-add-code-vip"
                (click)="addCodeVIP(code)"
                type="button">
          <mat-icon>build</mat-icon>
        </button>
        <button mat-button
                name="btn-delete-vip"
                color="primary"
                (click)="deleteCodeVIP(code)"
                ype="button"
                [disabled]="!tokenStorage.getUser()?.hasProfilSuperAdmin()">
          <mat-icon>delete_forever</mat-icon>
        </button>

      </td>
    </tr>
    <tr></tr>
    </tbody>
  </table>
  <p *ngIf="codes.length === 0"
     class="no-result">
    Aucun résultat ne correspond à votre recherche
  </p>
  <pagination-control *ngIf="codes && codes.length > 0"
                      [pagination]="pagination" (onPageChange)="search()">
  </pagination-control>
  `,
  styleUrls: ['./gestion-code-vip.component.scss'],

})
export class GestionCodeVipComponent implements OnInit {

  public codes: Array<CodeVIP> = [];
  public searchTerm!: string;

  pagination: PaginationService = new PaginationService({});
  sorting: SortingService = new SortingService();

  private mobileQueryListener: () => void;
  mobileQuery: MediaQueryList;

  constructor(private toast: ToastService,
              private route: ActivatedRoute,
              private router: Router,
              public dialog: MatDialog,
              private codeVIPService: CodeVIPService,
              private changeDetectorRef: ChangeDetectorRef,
              private media: MediaMatcher,
              public tokenStorage: TokenStorageService
  ) {
    this.mobileQuery = this.media.matchMedia('(max-width: 750px)');
    this.mobileQueryListener = () => {
      this.changeDetectorRef.detectChanges();
    };
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.onParamsChange(params);
    });
  }

  onParamsChange(params: any): void {
    this.searchTerm = params.searchTerm;
    this.pagination.currentPage = params.page;
    this.search();
  }

  deleteCodeVIP(code: CodeVIP): void {
    const dialogRef = this.dialog.open(PopinConfirmComponent, {
      data: {
        description: `Voulez-vous supprimer ce code ?`,
        hasBtnBack: true,
        hasTitle: true,
        title: 'Confirmation',
        hasBtnConfirm: true,
        textConfirm: 'Valider',
        textBack: 'Annuler',
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.codeVIPService.delete(code.codeId).subscribe(
          () => {
          this.toast.success(`Ce code est supprimé`);
          this.search();
          },
          err => this.toast.genericError(err)
        );
      }
    });
  }

  changeStatusCode(code: CodeVIP): void {
    const dialogRef = this.dialog.open(PopinConfirmComponent, {
      data: {
        description: `Voulez-vous ${!code.isEnabled ? 'activer' : 'désactiver'} ce code ?`,
        hasBtnBack: true,
        hasTitle: true,
        title: 'Confirmation',
        hasBtnConfirm: true,
        textConfirm: 'Valider',
        textBack: 'Annuler',
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
          this.codeVIPService.update(code).subscribe(
            () => this.toast.success(`Ce code est ${code.isEnabled ? 'activé' : 'désactivé'}`),
            err => this.toast.genericError(err)
          );
      } else {
        code.isEnabled = !code.isEnabled;
      }
    });
  }

  addCodeVIP(code: CodeVIP | null): void {
    const dialogRef = this.dialog.open(PopinCrudCodeVipComponent, {
      width: '400px',
      data: {codeVIP: code ? code : new CodeVIP({isEnabled: true})}
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data.result) {
        this.codeVIPService.add(data.codeVIP).subscribe(
          () => {
            this.toast.success(`Le code VIP est enregistré`);
            this.search();
          },
          err => this.toast.genericError(err)
        );
      }
    });
  }

  updateRoute(): void {
    this.router.navigate([], { queryParams: this.getQueryParams() });
  }

  getQueryParams(): any {
    const params = Object.assign({searchTerm: ''}, this.pagination.urlParams, this.sorting.urlParams);
    params.searchTerm = this.searchTerm;
    return params;
  }

  search(): void {
    this.updateRoute();

    const params = Object.assign({
      page: this.pagination.currentPage,
      sortBy: this.sorting.sortBy,
      sortOrder: this.sorting.sortOrder,
      searchTerm: this.searchTerm
    });

    this.codeVIPService.getAll( params).subscribe(
      (data) => {
        this.codes = data.result;
        this.pagination = data.pagination;
      },
      err => this.toast.genericError(err));
  }
}
