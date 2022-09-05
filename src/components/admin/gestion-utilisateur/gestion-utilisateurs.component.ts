import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import { forkJoin } from 'rxjs';

import {ToastService} from '../../../services/toast.service';
import {PaginationService} from '../../../services/pagination.service';
import {SortingService} from '../../../services/sorting.service';
import {  UserService } from '../../../services/user.service';
import {PopinService} from '../../../services/popin.service';

import {User} from '../../../models/user.model';
import {TokenStorageService} from "../../../services/token-storage.service";


@Component({
  selector:  'gestion-utilisateurs',
  template: `
<div class="block block-nb-users">
  <span>{{ nbUsers }}</span>
  <label>Joueurs</label>
</div>
<div class="block block-nb-users vip">
  <span>{{ nbUsersVIP }}</span>
  <label>Joueurs VIP</label>
</div>
<div class="block search">
  <mat-form-field>
      <input matInput
             placeholder="Tapez un mot clé"
             name="input-search"
             [(ngModel)]="searchTerm">
      <button mat-icon-button matSuffix type="button">
          <mat-icon color="accent">search</mat-icon>
      </button>
  </mat-form-field>
  <button mat-raised-button
          name="btn-search"
          color="accent"
          class="btn-search"
          type="submit"
          (click)="search()">
      Valider
  </button>
</div>
<table class="tableau" *ngIf="users.length > 0">
    <thead>
    <tr>
        <th (search)="search()">
            Email
        </th>
        <th (search)="search()">
            Pseudo
        </th>
        <th (search)="search()">
            Actif
        </th>

      <th (search)="search()" *ngIf="tokenStorage?.getUser()?.hasProfilAdmin()">
        Dernière connexion
      </th>
      <!--  <th (search)="search()">
            VIP
        </th>-->
        <th></th>
    </tr>
    </thead>
    <tbody>
    <tr class="details-prono" *ngFor="let user of users">
        <td><span>{{user.login}}</span></td>
        <td><span>{{user.pseudonyme}}</span></td>
      <td>
        <mat-icon *ngIf="!user.isEnabled" class="user-block" [matTooltip]="user.lastConnectionDate | date:'DD-MM-YYYY hh:mm'">block</mat-icon>
        <mat-icon *ngIf="user.isEnabled" class="user-actif" [matTooltip]="user.lastConnectionDate | date:'DD-MM-YYYY hh:mm'">check_circle_outline</mat-icon>

      </td>
      <td  *ngIf="tokenStorage?.getUser()?.hasProfilAdmin()">{{ user.lastConnectionDate  | date:'DD JANVIER YYYY à hh:mm' }}</td>
      <!--<td>
        {{ user.hasVIPValid() ? 'Oui' : 'Non' }}
      </td>-->
        <td class="td-actions">
            <button mat-icon-button [matMenuTriggerFor]="menu">
                <mat-icon color="primary">more_vert</mat-icon>
            </button>
            <mat-menu #menu="matMenu">
                <button mat-menu-item
                        name="btn-go-to-update"
                        (click)="goToUpdate(user)">
                    <mat-icon color="primary">build</mat-icon>
                    <span>Modifier</span>
                </button>
            </mat-menu>
        </td>
    </tr>
    </tbody>
</table>
<p *ngIf="users.length === 0" class="no-result">
  Aucun résultat ne correspond à votre recherche
</p>
<pagination-control *ngIf="users && users.length > 0"
                    [pagination]="pagination" (onPageChange)="search()">
</pagination-control>
  `,
  styleUrls: ['./gestion-utilisateurs.component.scss'],

})
export class GestionUtilisateursComponent implements OnInit {

  public searchTerm!: string;
  public users: Array<User> = [];

  pagination: PaginationService = new PaginationService({});
  sorting: SortingService = new SortingService();

  nbUsers: number = 0;
  nbUsersVIP: number = 0;

  constructor(private toast: ToastService,
              private popinService: PopinService,
              private route: ActivatedRoute,
              public tokenStorage: TokenStorageService,
              private router: Router,
              private userService: UserService) {}

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
    // @ts-ignore
    this.router.navigate([], { queryParams: this.getQueryParams() });
  }

  getQueryParams(): void {
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

    this.popinService.showLoader();
    forkJoin(
      this.userService.count(),
      this.userService.countVIP(),
      this.userService.getAll(params))
    .subscribe(
      ([nbUser, nbUserVIP, data]) => {
        this.nbUsers = nbUser;
        this.nbUsersVIP = nbUserVIP;
        this.users = data.result;
        this.pagination = data.pagination;
      },
      err => this.toast.genericError(err),
      () => this.popinService.closeLoader()
    );
  }

  goToUpdate(user: User): void {
    this.router.navigate(['administration', `utilisateurs`, user.id]);
  }
}
