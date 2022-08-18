import { Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import {ToastService} from '../../../services/toast.service';

import {GlobalParamService} from '../../../services/global-param.service';
import {PopinService} from '../../../services/popin.service';

import {GlobalParams} from '../../../models/global-params.model';

@Component({
  selector:  'list-bookmaker',
  styleUrls: ['./list-bookmaker.component.scss'],
  template: `

  <ul class="onglets">
    <li [class.onglet-selected]=""
        (click)="goToAbonnements()">Abonnements</li>
    <li [class.onglet-selected]="true"
        (click)="goToBookmaker()">Bookmakers</li>
  </ul>
  <ng-container *ngIf="globalParams">
    <p class="description-auth" *ngIf="globalParams?.bookmakers?.length !== 0">
    Vous pouvez bénéficier d'un mois VIP offert.
    <br/>
    Il suffit de nous parrainer en utilisant l'un des liens suivants
  </p>
  <div class="block2">

    <mat-card *ngFor="let bookmaker of globalParams.bookmakers">
      <mat-card-content>
        <img [src]="bookmaker?.urlLogo" [alt]="bookmaker.name">
        <p class="abo-description">{{bookmaker?.description}}</p>
      </mat-card-content>
      <mat-card-actions>
        <a [href]="bookmaker.url" target="_blank">Choisir</a>
      </mat-card-actions>
    </mat-card>
    <p *ngIf="globalParams.bookmakers.length === 0" class="no-result">
      Aucun bookmaker disponible pour le moment
    </p>
  </div>
  </ng-container>

  `,
})
export class ListBookmakerComponent implements OnInit {

  globalParams!: GlobalParams;

  constructor(private popinService: PopinService,
              private router: Router,
              private route: ActivatedRoute,
              private toast: ToastService,
              private globalParamsService: GlobalParamService) {}

  ngOnInit(): void {
    this.popinService.showLoader();
    this.globalParamsService.get().subscribe(
      globalParams => this.globalParams = globalParams,
      error => this.toast.genericError(error),
      () => this.popinService.closeLoader()
    );
  }

  goToBookmaker(): void {
    this.router.navigate(['bookmakers']);
  }

  goToAbonnements(): void {
    this.router.navigate(['abonnements']);
  }
}
