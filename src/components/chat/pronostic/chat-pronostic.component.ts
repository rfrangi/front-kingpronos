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
import {CommentaireService} from "../../../services/commentaire.service";

@Component({
  selector:  'app-chat-pronostic',
  styleUrls: ['./chat-pronostic.component.scss'],
  templateUrl: './chat-pronostic.component.html',
})
export class ChatPronosticComponent  implements OnInit {

  public commentaire: string = '';
  public idprono!: string;
  public commentaires: Array<Commentaire> = [];
  public pronostics: Array<Pronostic> = [];
  public pagination: PaginationService = new PaginationService({});

  constructor(private popinService: PopinService,
              private router: Router,
              private route: ActivatedRoute,
              private toast: ToastService,
              public tokenStorage: TokenStorageService,
              private pronosticsService: PronosticsService,
              private commentaireService: CommentaireService,
              private chatService: ChatService) {}

  public ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.onParamsChange(params);
    });
  }

  public onParamsChange(params: any): void {
    this.popinService.showLoader();
    const paramsApi = Object.assign({
      page: this.pagination.currentPage,
    });

    if (params.idpronostic) {
      this.idprono = params.idpronostic;
      forkJoin(
        this.chatService.getByIdProno(params.idpronostic, paramsApi),
      ).subscribe(
        ([data]) => {
          this.commentaires = data.result;
          this.pagination = data.pagintation;
          this.scrollBlock();
        },
        err => {
          this.toast.genericError(err);
        },
        () => this.popinService.closeLoader()
      );
    }
  }

  public goToUrl(urls: Array<string> = []): void {
    this.router.navigate(urls);
  }

  public sendMessage(): void {
    const data = {
      message: this.commentaire.trim(),
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

  public scrollBlock(): void {
    const items: HTMLCollectionOf<Element> = document.getElementsByClassName('chat');
    setTimeout(() => {
      for (const element of Array.from(items)) {
        element.scrollTop = element.scrollHeight;
      }
    }, 100 );
  }

  public loadLogoUser(commentaire: Commentaire): string {
    return commentaire.urlPhoto ? URL_STOCKAGE + commentaire.urlPhoto : 'assets/icons/picto-user.svg';
  }

  public removeCommentaire(commentaire: Commentaire): void {
    this.commentaireService.removeById(commentaire.id).subscribe({
      next: () => {
        this.commentaires = this.commentaires.filter((com: Commentaire) => com.id !== commentaire.id);
        this.toast.success('Le commentaire est supprimé.')
      },
      error: (err) => this.toast.genericError(err)
    })
  }
}
