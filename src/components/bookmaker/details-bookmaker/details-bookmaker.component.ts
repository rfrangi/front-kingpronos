import { Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import {ToastService} from '../../../services/toast.service';

import {GlobalParamService} from '../../../services/global-param.service';
import {PopinService} from '../../../services/popin.service';

import {GlobalParams} from '../../../models/global-params.model';
import {Bookmaker} from "../../../models/bookmaker.model";

@Component({
  selector:  'app-details-bookmaker',
  styleUrls: ['./details-bookmaker.component.scss'],
  template: `
    <mat-card *ngIf="bookmaker" class="bg-dark mx-auto d-block shadow mb-4">
      <mat-card-content class="text-center">
        <img [src]="bookmaker?.urlLogo" [alt]="bookmaker.name">
        <p class="abo-description my-3">{{bookmaker?.description}}</p>
      </mat-card-content>
      <mat-card-actions class="text-center">
        <a *ngIf="!isAdmin" [href]="bookmaker.url" target="_blank" class="">Choisir</a>
        <a *ngIf="isAdmin" (click)="edit.emit(bookmaker)">Modifier</a>
        <a *ngIf="isAdmin" class="ms-3" (click)="remove.emit(bookmaker)">Supprimer</a>
      </mat-card-actions>
    </mat-card>
  `,
})
export class DetailsBookmakerComponent implements OnInit {

  @Input() bookmaker!: Bookmaker;
  @Input() isAdmin: boolean = false;
  @Output() edit = new EventEmitter();
  @Output() remove = new EventEmitter();

  constructor() {}

  ngOnInit(): void {

  }
}
