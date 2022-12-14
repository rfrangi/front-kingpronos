import { Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Bookmaker} from "../../../models/bookmaker.model";

@Component({
  selector:  'app-details-bookmaker',
  styleUrls: ['./details-bookmaker.component.scss'],
  template: `
    <mat-card *ngIf="bookmaker" class="bg-dark mx-auto d-block shadow mb-3">
      <mat-card-content class="text-center">
        <img [src]="bookmaker.urlLogo" [alt]="bookmaker.name">
        <p class="abo-description my-3">{{bookmaker.description}}</p>
      </mat-card-content>
      <mat-card-actions class="text-center">
        <a *ngIf="!isAdmin" [href]="bookmaker.url" target="_blank" class="d-block m-2 p-2 rounded">Choisir</a>
        <a *ngIf="isAdmin" (click)="edit.emit(bookmaker)" class="d-inline-block m-2 p-2 rounded">Modifier</a>
        <a *ngIf="isAdmin" (click)="remove.emit(bookmaker)" class="d-inline-block m-2 ms-3 p-2 rounded">Supprimer</a>
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
