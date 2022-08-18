import { Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';

import {Abonnement} from '../../../models/abonnement.model';

import {TokenStorageService} from '../../../services/token-storage.service';
import {AbonnementService} from '../../../services/abonnement.service';
import { UserService } from '../../../services/user.service';
import {PopinService} from '../../../services/popin.service';
import {ToastService} from '../../../services/toast.service';
import {User} from "../../../models/user.model";

@Component({
  selector:  'list-paiement',
  styleUrls: ['./list-paiement.component.scss'],
  template: `
<div class="block" *ngIf="abonnement && payPalConfig">
  <span class="label-choice">Vous avez choisi:</span>
</div>

<div class="block-abo" *ngIf="abonnement">
  <mat-card>
    <mat-card-content>
      <h2>{{abonnement.label}}</h2>
      <span class="picto-price">{{abonnement.price}} €</span>
      <p class="abo-description">{{abonnement.description}}</p>
    </mat-card-content>
  </mat-card>
</div>
<!--<div #paypal></div>-->
    <div class="block" *ngIf="abonnement && payPalConfig">
    <span>Vous avez choisi:</span>
    <span class="label-abonnement">{{abonnement.label}}</span>
    <ngx-paypal [config]="payPalConfig"></ngx-paypal>

    <div class="action-link">
      <a (click)="goToAbonnements()">
        <mat-icon>keyboard_arrow_left</mat-icon>
        Retour
      </a>
    </div>
  </div><!--
<a (click)="test()">
  <mat-icon>keyboard_arrow_left</mat-icon>
  addPaiement
</a>-->
  `,
})
export class ListPaiementComponent  implements OnInit {

  public payPalConfig: IPayPalConfig | undefined;
  public showSuccess: boolean | undefined;
  public showError: boolean | undefined;
  public showCancel: boolean | undefined;

  abonnement: Abonnement = new Abonnement();

  @ViewChild('paypal', { static: true }) paypalElement!: ElementRef;

  constructor(private popinService: PopinService,
              private router: Router,
              private toast: ToastService,
              private route: ActivatedRoute,
              private abonnementService: AbonnementService,
              private userService: UserService,
              private tokenStorage: TokenStorageService) {}

 public ngOnInit(): any {
    this.route.params.subscribe(params => {
      this.onParamsChange(params);
    });
  }

  public goToAbonnements(): any {
    this.router.navigate([`abonnements`]);
  }

  public onParamsChange(params: any): any {
    if (params.id) {
      this.popinService.showLoader();
      this.abonnementService.getById(params.id).subscribe(
          abonnement => {
            this.abonnement = abonnement;
            console.log(this.abonnement, this.abonnement?.price.toString());
            this.initConfig();
          },
          err => this.toast.genericError(err),
          () => this.popinService.closeLoader()
        );
    }
  }

  private initConfig(): void {
    // 4020024113207755
    this.payPalConfig = {
      currency: 'EUR',
      clientId: 'AWzo3ULYdDSkJpnIZavvXj_G7cXf7aYJ5LXT3ONnXK5yHghIARM7d75R7wJZYCHKNAF6UHDTHxbmTtMl',
     // clientId: 'AYFLv_yjxjTz9S6eqBK_iXw9zXq4D08fqtXKegoTzNtqKhaIIofVCGtd44LiuIRs70_jD893Ys8wfXfJ',

      createOrderOnClient: (data) => <ICreateOrderRequest> {
        intent: 'CAPTURE',
       // intent: 'AUTHORIZE',
        purchase_units: [{
          amount: {
            currency_code: 'EUR',
            value: this.abonnement?.price.toString(),
            breakdown: {
              item_total: {
                currency_code: 'EUR',
                value: this.abonnement?.price.toString()
              }
            }
          },
          items: [{
            name: `Abonnement ${this.abonnement.nbJour} Jr(s)`,
            description: this.abonnement.label,
            quantity: '1',
            category: 'DIGITAL_GOODS',
            unit_amount: {
              currency_code: 'EUR',
              value: this.abonnement?.price.toString()
            },
          }]
        }]
      },
      advanced: {
        commit: 'true'
      },
      style: {
        label: 'paypal',
        layout: 'vertical'
      },
      onApprove: (data, actions) => {
        console.log('onApprove -la transaction a été approuvée, mais pas autorisée', data, actions);
       /* actions.order.get().then((details: any) => {
          console.log('onApprove - vous pouvez obtenir tous les détails de la commande dans onApprove: ', details);
          const body = {
            idUser: this.tokenStorage.getUser()?.id,
            idCmdPaypal: details.id,
            statusCmdPaypal: details.status,
            label: this.abonnement.label,
            nbJour: this.abonnement.nbJour,
            price: this.abonnement.price,
            creationDate: new Date()
          }*/

      },
      onClientAuthorization: (data) => {
        console.log('onClientAuthorization - vous devriez probablement informer votre serveur de la transaction terminée à ce stade', data);
        const body = {
          idUser: this.tokenStorage.getUser()?.id,
          idCmdPaypal: data.id,
          statusCmdPaypal: data.status,
          label: this.abonnement.label,
          nbJour: this.abonnement.nbJour,
          price: this.abonnement.price,
          creationDate: new Date()
        }
        this.popinService.showLoader();
        this.userService.addAbonnement(body).subscribe({
          next: (user: User) => {
            console.log(user);
            this.tokenStorage.saveUser(user);
            this.toast.success('Votre abonnement est enregistrée');
            // this.userService.getFacture().subscribe();
            this.popinService.closeLoader();
            this.router.navigate(['home']);
          },
          error: (err: any) => {
            this.toast.genericError(err);
            this.popinService.closeLoader();
          }
        });
      },
      onCancel: (data, actions) => {
        console.log('OnCancel', data, actions);
        this.showCancel = true;

      },
      onError: err => {
        console.log('OnError', err);
        this.showError = true;
      },
      onClick: (data, actions) => {
        console.log('onClick', data, actions);
        this.resetStatus();
      }
    };
  }

  private resetStatus(): void {
    this.showError = false;
    this.showSuccess = false;
    this.showCancel = false;
  }

  public test(): void {
    const details = {
      "id": "8VS17843E91443927",
      "intent": "CAPTURE",
      "status": "APPROVED",
      "purchase_units": [
        {
          "reference_id": "default",
          "amount": {
            "currency_code": "EUR",
            "value": "1.00",
            "breakdown": {
              "item_total": {
                "currency_code": "EUR",
                "value": "1.00"
              }
            }
          },
          "payee": {
            "email_address": "kingpronos.service.contact@gmail.com",
            "merchant_id": "H289AK67SRAZY"
          },
          "items": [
            {
              "name": "Abonnement",
              "unit_amount": {
                "currency_code": "EUR",
                "value": "1.00"
              },
              "quantity": "1",
              "description": "abonnement 1 JouR ttc",
              "category": "DIGITAL_GOODS"
            }
          ],
          "shipping": {
            "name": {
              "full_name": "perrine frangi"
            },
            "address": {
              "address_line_1": "30 rue seraphin cordier",
              "admin_area_2": "carnin",
              "postal_code": "59112",
              "country_code": "FR"
            }
          }
        }
      ],
      "payer": {
        "name": {
          "given_name": "perrine",
          "surname": "frangi"
        },
        "email_address": "romain.frangi@cleverconnect.com",
        "payer_id": "9NPKE5VWGSJZE",
        "address": {
          "country_code": "FR"
        }
      },
      "create_time": "2022-08-11T14:42:56Z",
      "links": [
        {
          "href": "https://api.paypal.com/v2/checkout/orders/8VS17843E91443927",
          "rel": "self",
          "method": "GET"
        },
        {
          "href": "https://api.paypal.com/v2/checkout/orders/8VS17843E91443927",
          "rel": "update",
          "method": "PATCH"
        },
        {
          "href": "https://api.paypal.com/v2/checkout/orders/8VS17843E91443927/capture",
          "rel": "capture",
          "method": "POST"
        }
      ]
    };

    const body = {
      idUser: this.tokenStorage.getUser()?.id,
      idCmdPaypal: details.id,
      statusCmdPaypal: details.status,
      label: this.abonnement.label,
      nbJour: this.abonnement.nbJour,
      price: this.abonnement.price,
      creationDate: new Date()
    }
    this.userService.addAbonnement(body).subscribe({
      next: (user: User) => {
        console.log(user);
        this.tokenStorage.saveUser(user);
        this.toast.success('Votre abonnement est enregistrée');
       // this.userService.getFacture().subscribe();
        this.router.navigate(['home']);
      },
      error: (err: any) => {
        this.toast.genericError(err);
      }
    })
  }


}

/*
{
  "id": "8VS17843E91443927",
  "intent": "CAPTURE",
  "status": "APPROVED",
  "purchase_units": [
  {
    "reference_id": "default",
    "amount": {
      "currency_code": "EUR",
      "value": "1.00",
      "breakdown": {
        "item_total": {
          "currency_code": "EUR",
          "value": "1.00"
        }
      }
    },
    "payee": {
      "email_address": "kingpronos.service.contact@gmail.com",
      "merchant_id": "H289AK67SRAZY"
    },
    "items": [
      {
        "name": "Abonnement",
        "unit_amount": {
          "currency_code": "EUR",
          "value": "1.00"
        },
        "quantity": "1",
        "description": "abonnement 1 JouR ttc",
        "category": "DIGITAL_GOODS"
      }
    ],
    "shipping": {
      "name": {
        "full_name": "perrine frangi"
      },
      "address": {
        "address_line_1": "30 rue seraphin cordier",
        "admin_area_2": "carnin",
        "postal_code": "59112",
        "country_code": "FR"
      }
    }
  }
],
  "payer": {
  "name": {
    "given_name": "perrine",
      "surname": "frangi"
  },
  "email_address": "romain.frangi@cleverconnect.com",
    "payer_id": "9NPKE5VWGSJZE",
    "address": {
    "country_code": "FR"
  }
},
  "create_time": "2022-08-11T14:42:56Z",
  "links": [
  {
    "href": "https://api.paypal.com/v2/checkout/orders/8VS17843E91443927",
    "rel": "self",
    "method": "GET"
  },
  {
    "href": "https://api.paypal.com/v2/checkout/orders/8VS17843E91443927",
    "rel": "update",
    "method": "PATCH"
  },
  {
    "href": "https://api.paypal.com/v2/checkout/orders/8VS17843E91443927/capture",
    "rel": "capture",
    "method": "POST"
  }
]
}
*/
