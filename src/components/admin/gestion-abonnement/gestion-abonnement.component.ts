import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';

import {PopinConfirmComponent} from '../../core/popin/popin-confirm/popin-confirm.component';

import { PopinCrudAbonnementComponent } from '../popin-crud-abonnement/popin-crud-abonnement.component';

import { AbonnementService} from '../../../services/abonnement.service';
import {PaginationService} from '../../../services/pagination.service';
import {SortingService} from '../../../services/sorting.service';
import {TokenStorageService} from '../../../services/token-storage.service';
import {ToastService} from '../../../services/toast.service';
import {PopinService} from '../../../services/popin.service';

import {Abonnement} from '../../../models/abonnement.model';

@Component({
  selector:  'gestion-abonnements',
  template: `
<div class="ajouter block">
  <mat-form-field>
    <input matInput placeholder="Tapez un mot clé"  name="input-search" [(ngModel)]="searchTerm">
  </mat-form-field>
  <button mat-raised-button
          name="btn-action-search"
          class="btn-action btn-search"
          type="submit"
          matTooltip="Rechercher"
          color="primary"
          (click)="search()">
    <mat-icon>search</mat-icon>
  </button>
  <button mat-raised-button
          color="primary"
          name="btn-add-abo"
          matTooltip="Ajouter un abonnement"
          type="submit"
          class="btn-action valider"
          (click)="update(undefined)">
    <mat-icon>playlist_add</mat-icon>
  </button>
</div>

<list-abonnement
  [abonnements]="abonnements"
  [isModeAdmin]="true"
  (gotodeleteEvent)="delete($event)"
  (gotoUpdateEvent)="update($event)">
</list-abonnement>
  `,
  styleUrls: ['./gestion-abonnement.component.scss'],

})
export class GestionAbonnementComponent implements OnInit {

  public searchTerm!: string;
  abonnements: Array<Abonnement> = [];

  pagination: PaginationService = new PaginationService({});
  sorting: SortingService = new SortingService();

  constructor(private toast: ToastService,
              private route: ActivatedRoute,
              private router: Router,
              private popinService: PopinService,
              private abonnementService: AbonnementService,
              private tokenStorage: TokenStorageService) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.onParamsChange(params);
    });
  }

  onParamsChange(params: any): void {
    this.searchTerm = params.searchTerm;
    this.pagination.currentPage = params.page;
    this.sorting.setParams(params);
    this.search();
  }

  updateRoute(): void {

    this.router.navigate([], { queryParams: this.getQueryParams() });
  }

  getQueryParams(): any {
    const params = Object.assign({searchTerm: ''}, this.pagination.urlParams);
    params.searchTerm = this.searchTerm;
    return params;
  }

  search(): void {
    this.updateRoute();

    const params = Object.assign({
      page: this.pagination.currentPage,
      searchTerm: this.searchTerm
    });

    this.popinService.showLoader();
    this.abonnementService.getAllPaginated(params, this.tokenStorage.getUser()?.hasProfilAdmin()).subscribe(
      (data: any) => {
        this.abonnements = data.result.sort((key1: { price: number; }, key2: { price: number; }) => {
          return key1.price < key2.price ? -1 : 1;
        });
        console.log(this.abonnements);
        this.pagination = data.pagination;
      },
      err => this.toast.genericError(err),
      () => this.popinService.closeLoader()
    );
  }

  update(abonnement: Abonnement | undefined): void {
    this.popinService.openPopin(PopinCrudAbonnementComponent, {
      data: {abonnement: abonnement ? abonnement : new Abonnement()}
    }).subscribe(
      () => this.search()
    );
  }

  delete(abonnement: Abonnement): void {
    this.popinService.openPopin(PopinConfirmComponent, {
      data: {
        description: `Voulez-vous supprimer l'abonnement`,
        hasBtnBack: true,
        hasTitle: true,
        hasBtnConfirm: true,
        textConfirm: 'Confirmer',
        textBack: 'Retour',
      }
    }).subscribe(result => {
      if (result) {
        this.popinService.showLoader();
        this.abonnementService.delete(abonnement.id).subscribe(
            () => {
              this.search();
              this.toast.success(`Votre abonnement est supprimé`);
            },
            err => this.toast.genericError(err),
            () => this.popinService.closeLoader()
          );
      }
    });
  }
}
