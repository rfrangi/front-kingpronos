import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

import {ToastService} from '../../../services/toast.service';
import {GlobalParamService} from '../../../services/global-param.service';

import {GlobalParams} from '../../../models/global-params.model';

@Component({
  selector:  'page-contact',
  template: `
<ng-container *ngIf="globalParams">
  <div class="block">
    <h3>Coordonnées</h3>
    <p>Tu peux nous contacter par e-mail <span>{{ globalParams.mail }}</span>, en utilisant le formulaire de contact.</p>
  </div>

  <div class="block">
    <h3>Feedback</h3>
    <p>Tu es satisfait ou tu as une suggestion à nous faire ? Fais le nous savoir !
      Il vous suffit de nous faire parvenir un Email à l'adresse suivante
      <span>{{ globalParams.mail }}</span>
    </p>
  </div>

  <div class="block">
    <h3>Blogueur</h3>
    <p>Vous êtes blogueur et vous avez envie de collaborer avec nous ?
      Nous sommes ravis de l'apprendre ! Il vous suffit de nous faire parvenir un Email à l'adresse suivante
      <span> {{ globalParams.mailCoorporation }}</span> en nous parlant de vous et de vos projets en vue d'une future collaboration.
      Si vous possédez déjà un kit média, merci de nous le faire également parvenir.
      Nous pourrons ainsi envisager une collaboration encore plus harmonieuse !
    </p>
  </div>

  <div class="block" *ngIf="globalParams.urlFacebook">
    <h3>Jeu concours</h3>
    <p>La meilleure solution est de liker notre page <a [href]="globalParams.urlFacebook">Facebook</a>.
      Comme ça, tu seras toujours mise au courant quand il y aura un jeu concours, des promotions, etc.
    </p>
  </div>
</ng-container>
  `,
  styleUrls: ['./page-contact.component.scss'],

})
export class PageContactComponent implements OnInit {

  globalParams!: GlobalParams;

  constructor(private toast: ToastService,
              private router: Router,
              public dialog: MatDialog,
              private globalParamsService: GlobalParamService) {}

  ngOnInit(): void {
    this.globalParamsService.get().subscribe(
      globalParams => {
        this.globalParams = globalParams;
      },
      error => {
        this.toast.genericError(error);
      }
    );
  }
}
