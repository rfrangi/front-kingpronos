import { Injectable } from "@angular/core";
import { Resolve } from "@angular/router";
import { Observable } from "rxjs";
import {Abonnement} from '../models/abonnement.model';
import {AbonnementService} from '../services/abonnement.service';

@Injectable({ providedIn: 'root' })
export class AbonnementsResolver implements Resolve<Abonnement[]> {

  constructor(private abonnementService: AbonnementService) {}

  resolve(): Observable<Abonnement[]> {
    return this.abonnementService.getAll({});
  }
}
