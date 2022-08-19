import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import { FormBuilder } from '@angular/forms';

import {ToastService} from '../../../../services/toast.service';
import {PopinService} from '../../../../services/popin.service';
import {BookmakersService} from "../../../../services/bookmakers.service";
import {Bookmaker} from "../../../../models/bookmaker.model";
import {PopinDetailsBookmakerComponent} from "./popin-details-bookmaker/popin-details-bookmaker.component";

@Component({
  selector:  'app-gestion-bookmakers',
  templateUrl: './gestion-bookmakers.component.html',
  styleUrls: ['./gestion-bookmakers.component.scss'],

})
export class GestionBookmakerComponent implements OnInit {

  public bookmakers: Array<Bookmaker> = [];

  constructor(private popinService: PopinService,
              private router: Router,
              private route: ActivatedRoute,
              private toast: ToastService,
              private bookmakersService: BookmakersService,
              private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.bookmakersService.getAll().subscribe({
      next: (bookmakers) => {
        console.log(bookmakers);
        this.bookmakers = bookmakers;
      }
    })
  }

  public showPopinDetailsBookmaker(bookmaker?: Bookmaker): void {
    this.popinService.openPopin(PopinDetailsBookmakerComponent, {
      data: {bookmaker: bookmaker ? bookmaker : new Bookmaker()}
    }).subscribe({
      next:(response) => {
        console.log(response)
        if(response.confirm) {
          this.bookmakersService.save(response.bookmaker).subscribe({
            next: () => {
              this.toast.success(`Le bookmaker est enregistré.`)
              this.ngOnInit();
            },
            error: (err: any) => {
              this.toast.genericError(err);
            }
          })
        }
      }
      }
    );
  }

  public removeBookmaker(bookmaker: Bookmaker) {
    this.bookmakersService.delete(bookmaker.id).subscribe({
      next: () => {
        this.toast.success(`Le bookmaker est supprimé.`)
        this.ngOnInit();
      },
      error: (err: any) => {
        this.toast.genericError(err);
      }
    })
  }
}
