import { Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router } from '@angular/router';

import { forkJoin } from 'rxjs';

import {ToastService} from '../../../services/toast.service';
import {PopinService} from '../../../services/popin.service';

import {Pronostic} from '../../../models/pronostic.model';
import {PronosticsService} from '../../../services/pronostic.service';
import {Commentaire} from '../../../models/commentaire.model';
import {ChatService} from '../../../services/chat.service';
import {PaginationService} from '../../../services/pagination.service';
import {TokenStorageService} from '../../../services/token-storage.service';
import {URL_STOCKAGE} from '../../../utils/fetch';


@Component({
  selector:  'chat-pronostic',
  styleUrls: ['./chat-pronostic.component.scss'],
  template: `
    <list-prono [pronostics]="pronostics" [pageChat]="true"></list-prono>
    <div class="block">
      <h3>Commentaires</h3>
      <span *ngIf="commentaires.length === 0" class="no-com">Soyer le premier à commenter ce poste</span>
    </div>
    <div class="block chat" *ngIf="commentaires.length > 0">
      <div *ngFor="let com of commentaires" class="commentaire">
        <img [src]="loadLogoUser(com)" alt="logo-user">
        <div class="content-message">
          <span class="pseudonyme">{{ com.pseudonyme}}</span>
          <span class="message"> {{ com.message}}</span>
        </div>
      </div>
    </div>
    <div class="block ajouter">
        <mat-form-field>
          <textarea matInput
                required
                [(ngModel)]="commentaire"
                name="send-message"
                maxlength="200"
                placeholder="Ecrire un commentaire">
           </textarea>
        </mat-form-field>
      <button mat-button
              (click)="sendMessage()"
              class="valider"
              [disabled]="commentaire.length < 1"
              name="btn-valider"
              color="primary"
              type="button">
            Envoyer
      </button>
    </div>
  `,
})
export class ChatPronosticComponent  implements OnInit {

  commentaire: string = '';
  idprono!: string;
  commentaires: Array<Commentaire> = [];
  pronostics: Array<Pronostic> = [];
  pagination: PaginationService = new PaginationService({});

  constructor(private popinService: PopinService,
              private router: Router,
              private route: ActivatedRoute,
              private toast: ToastService,
              private tokenStorage: TokenStorageService,
              private pronosticsService: PronosticsService,
              private chatService: ChatService) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.onParamsChange(params);
    });
  }

  onParamsChange(params: any): void {
    this.popinService.showLoader();
    const paramsApi = Object.assign({
      page: this.pagination.currentPage,
    });

    if (params.idpronostic) {
      this.idprono = params.idpronostic;
      forkJoin(
        this.chatService.getByIdProno(params.idpronostic, paramsApi),
        this.pronosticsService.getById(params.idpronostic)
      ).subscribe(
        ([data, pronostic]) => {
          this.commentaires = data.result;
          this.pagination = data.pagintation;
          this.pronostics.push(pronostic);
          this.scrollBlock();
        },
        err => {
          this.toast.genericError(err);
        },
        () => this.popinService.closeLoader()
      );
    }
  }

  sendMessage(): void {

    const data = {
      message: this.commentaire,
      pseudonyme: this.tokenStorage.getUser()?.pseudonyme,
      idUser: this.tokenStorage.getUser()?.id,
      urlPhoto: this.tokenStorage.getUser()?.logo,
      creationDate: new Date()
    };

    this.chatService.addOnProno(this.idprono, new Commentaire(data)).subscribe(
      (resp: any) => {
        this.commentaires = resp.result;
        this.pagination = resp.pagintation;
        this.commentaire = ' ';
        this.scrollBlock();

      },
      err => this.toast.genericError(err)
    );
  }

  scrollBlock(): void {
    const items: HTMLCollectionOf<Element> = document.getElementsByClassName('chat');
    setTimeout(() => {
      for (const element of Array.from(items)) {
        element.scrollTop = element.scrollHeight;
      }
    }, 100 );
  }

  loadLogoUser(commentaire: Commentaire): string {
    return commentaire.urlPhoto ? URL_STOCKAGE + commentaire.urlPhoto : 'assets/icons/picto-user.svg';
  }

}
