import { Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import {ToastService} from '../../../services/toast.service';

import {GlobalParamService} from '../../../services/global-param.service';
import {PopinService} from '../../../services/popin.service';

import {GlobalParams} from '../../../models/global-params.model';
import {BookmakersService} from "../../../services/bookmakers.service";
import {Bookmaker} from "../../../models/bookmaker.model";

@Component({
  selector:  'list-bookmaker',
  styleUrls: ['./list-bookmaker.component.scss'],
  template: `

  <ul class="onglets">
    <li class="shadow" [class.onglet-selected]=""
        (click)="goToAbonnements()">Abonnements</li>
    <li class="shadow" [class.onglet-selected]="true"
        (click)="goToBookmaker()">Bookmakers</li>
  </ul>
    <p class="description-auth" *ngIf="bookmakers?.length !== 0">
    Vous pouvez bénéficier d'un mois VIP offert.
    <br/>
    Il suffit de nous parrainer en utilisant l'un des liens suivants
  </p>
  <div class="block2">
    <ng-container *ngFor="let bookmaker of bookmakers">
      <app-details-bookmaker [bookmaker]="bookmaker"></app-details-bookmaker>
    </ng-container>
    <p *ngIf="bookmakers.length === 0" class="no-result">
      Aucun bookmaker disponible pour le moment
    </p>
  </div>

  `,
})
export class ListBookmakerComponent implements OnInit {

  globalParams!: GlobalParams;
  public bookmakers: Array<Bookmaker> = [];

  constructor(private popinService: PopinService,
              private router: Router,
              private route: ActivatedRoute,
              private toast: ToastService,
              private bookmakerService: BookmakersService) {}

  ngOnInit(): void {
    this.popinService.showLoader();
    this.bookmakerService.getAll().subscribe({
      next: (bookmaskers: Array<Bookmaker>) =>  {
        this.bookmakers = bookmaskers;
        this.popinService.closeLoader()
      },
      error: (err: any) => {
        this.popinService.closeLoader()
        this.toast.genericError(err)
    }
    });
  }

  goToBookmaker(): void {
    this.router.navigate(['bookmakers']);
  }

  goToAbonnements(): void {
    this.router.navigate(['abonnements']);
  }
}
