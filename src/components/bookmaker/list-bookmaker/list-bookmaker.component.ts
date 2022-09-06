import { Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import {ToastService} from '../../../services/toast.service';

import {PopinService} from '../../../services/popin.service';

import {GlobalParams} from '../../../models/global-params.model';
import {BookmakersService} from "../../../services/bookmakers.service";
import {Bookmaker} from "../../../models/bookmaker.model";

@Component({
  selector:  'list-bookmaker',
  styleUrls: ['./list-bookmaker.component.scss'],
  templateUrl: './list-bookmaker.component.html',
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
