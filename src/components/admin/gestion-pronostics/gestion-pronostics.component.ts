import { Component, OnInit, } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {PopinPronosticComponent} from '../../core/popin/popin-pronostic/popin-pronostic.component';

import { PronosticsService} from '../../../services/pronostic.service';
import {PaginationService} from '../../../services/pagination.service';
import { SortingService } from '../../../services/sorting.service';
import {TokenStorageService} from '../../../services/token-storage.service';
import {ToastService} from '../../../services/toast.service';
import { PopinService } from '../../../services/popin.service';

import { Pronostic } from '../../../models/pronostic.model';

@Component({
  selector:  'gestion-pronostics',
  template: `
  <div class="search block">
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
            name="btn-add"
            matTooltip="Ajouter une publication"
            type="submit"
            class="btn-action valider"
            (click)="addProno()">
      <mat-icon>playlist_add</mat-icon>
    </button>
  </div>
  <list-prono [pronostics]="pronostics" [isAdmin]="true" (changeListProno)="search()"></list-prono>
   <pagination-control *ngIf="pronostics && pronostics.length > 0"
                       [pagination]="pagination" (onPageChange)="search()">
   </pagination-control>
  `,
  styleUrls: ['./gestion-pronostics.component.scss'],

})
export class GestionPronosticsComponent implements OnInit {

  public searchTerm!: string;
  public pronostics: Array<Pronostic> = [];
  pagination: PaginationService = new PaginationService({});
  sorting: SortingService = new SortingService();

  constructor(private toast: ToastService,
              private route: ActivatedRoute,
              private router: Router,
              private popinService: PopinService,
              private pronosticService: PronosticsService,
              private tokenStorage: TokenStorageService) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.onParamsChange(params);
    });
  }

  onParamsChange(params: any): void  {
    this.searchTerm = params.searchTerm;
    this.pagination.currentPage = params.page;
    this.sorting.setParams(params);
    this.search();
  }

  updateRoute(): void  {
    this.router.navigate([], { queryParams: this.getQueryParams() });
  }

  getQueryParams(): any  {
    const params = Object.assign({searchTerm: ''}, this.pagination.urlParams, this.sorting.urlParams);
    params.searchTerm = this.searchTerm;
    return params;
  }

  search(): void  {
    this.updateRoute();

    const params = Object.assign({
      page: this.pagination.currentPage,
      sortBy: this.sorting.sortBy,
      sortOrder: this.sorting.sortOrder,
      searchTerm: this.searchTerm
    });

    Object.assign(params, this.searchTerm);

    this.popinService.showLoader();
    this.pronosticService.getAll(params, this.tokenStorage.getUser()?.hasProfilAdmin())
    .subscribe(
      data => {
        this.pronostics = data.result;
        this.pagination = data.pagination;
      },
      err => this.toast.genericError(err),
      () => this.popinService.closeLoader()
    );
  }

  addProno(): void  {
    this.router.navigate(['administration', `pronostics`, 'ajouter']);
  }

  goToUpdate(prono: Pronostic): void  {
   this.router.navigate(['administration', `pronostics`, prono.id]);
  }

  goToResume(prono: Pronostic): void  {
    this.popinService.openPopin(PopinPronosticComponent, {
      data: {
        pronostics: [ prono ]
      }
    });
  }
}
