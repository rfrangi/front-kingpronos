import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import { FormControl, FormGroup, Validators } from '@angular/forms';

import {ToastService} from '../../../../services/toast.service';
import {PopinService} from '../../../../services/popin.service';
import {GlobalParamService} from '../../../../services/global-param.service';
import {GlobalParams} from "../../../../models/global-params.model";

@Component({
  selector:  'app-gestion-contacts',
  templateUrl: './gestion-bankroll.component.html',
  styleUrls: ['./gestion-bankroll.component.scss'],

})
export class GestionBankrollComponent implements OnInit {

  public globalParams!: GlobalParams;
  public groupForm: FormGroup = new FormGroup({});

  constructor(private popinService: PopinService,
              private router: Router,
              private route: ActivatedRoute,
              private toast: ToastService,
              private globalParamsService: GlobalParamService) {}

  public ngOnInit(): void {
    this.popinService.showLoader();
    this.initForm();
    this.globalParamsService.get().subscribe(
      globalParams => {
        this.globalParams = globalParams;
        this.initForm();
      },
      error => {
        this.toast.genericError(error);
      },
      () => this.popinService.closeLoader()
    );
  }

  public initForm(): void {
    this.groupForm = new FormGroup({
      globalparamsId: new FormControl(this.globalParams ? this.globalParams.globalparamsId : ''),
      bankrollDepart: new FormControl(this.globalParams ? this.globalParams.bankrollDepart : '', [ Validators.required]),
      bankrollCurrent: new FormControl({value: this.globalParams ? this.globalParams.bankrollCurrent : '', disabled: false}),
    });
  }

  public onSubmit(): void {
    Object.assign(this.globalParams, this.groupForm.value);
    this.popinService.showLoader(`Enregistrement en cours...`);
    this.globalParamsService.save(this.globalParams).subscribe(
      (globalParams: GlobalParams) => {
        this.globalParams = globalParams;
        this.toast.success(`Vos données sont enregistrées`);
        this.initForm();
      },
      error => {
        this.toast.genericError(error);
      },
      () => this.popinService.closeLoader()
    );
  }
}
