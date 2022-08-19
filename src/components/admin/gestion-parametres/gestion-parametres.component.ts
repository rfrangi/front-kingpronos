import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';

import {ToastService} from '../../../services/toast.service';
import {PopinService} from '../../../services/popin.service';
import {GlobalParamService} from '../../../services/global-param.service';

import { MyErrorStateMatcher } from '../../../utils/validation';

import {GlobalParams} from '../../../models/global-params.model';
import {Bookmaker} from "../../../models/bookmaker.model";

@Component({
  selector:  'app-gestion-parametres',
  templateUrl: './gestion-parametres.component.html',
  styleUrls: ['./gestion-parametres.component.scss'],
})
export class GestionParametresComponent {

  globalParams!: GlobalParams;
  groupForm: FormGroup = new FormGroup({});
  matcher = new MyErrorStateMatcher();
  step = 0;
  bookmakers = new FormArray([]);

  constructor(private popinService: PopinService,
              private router: Router) {}

  goToUrl(urls: Array<string> = []): void {
    this.router.navigate(urls);
  }

}
