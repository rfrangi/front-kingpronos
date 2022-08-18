import { Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {PopinService} from '../../../services/popin.service';
import {ToastService} from '../../../services/toast.service';

import {Abonnement} from '../../../models/abonnement.model';

@Component({
  selector:  'page-abonnement',
  styleUrls: ['./page-abonnement.component.scss'],
  template: `
  <ul class="onglets">
    <li [class.onglet-selected]="true"
        (click)="goToAbonnements()">
      Abonnements
    </li>
    <li [class.onglet-selected]=""
        (click)="goToBookmaker()">
      Bookmakers
    </li>
  </ul>
  <list-abonnement
    [abonnements]="abonnements"
    (gotoPaiementEvent)="goToPaiement($event)">
  </list-abonnement>
  `,
})
export class PageAbonnementComponent  implements OnInit {

  abonnements: Array<Abonnement> = [];

  constructor(private popinService: PopinService,
              private router: Router,
              private route: ActivatedRoute,
              private toast: ToastService) {}

  ngOnInit(): void {
    this.route.data.subscribe(
      (data: any) => this.abonnements = data.abonnements.sort((key1: { price: number; }, key2: { price: number; }) => {
        return key1.price - key2.price < 0 ? -1 : 1;
      }),
      (err: any) => this.toast.genericError(err),
    );
  }

  goToPaiement(abonnement: Abonnement): void {
    this.router.navigate([`abonnements`, abonnement.id, 'paiement']);
  }

  goToBookmaker(): void {
    this.router.navigate(['bookmakers']);
  }

  goToAbonnements(): void {
    this.router.navigate(['abonnements']);
  }
}
