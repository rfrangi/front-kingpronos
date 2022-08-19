import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

import {ToastService} from '../../../../services/toast.service';
import {PopinService} from '../../../../services/popin.service';
import {GlobalParamService} from '../../../../services/global-param.service';
import {Bookmaker} from "../../../../models/bookmaker.model";
import {GlobalParams} from "../../../../models/global-params.model";

@Component({
  selector:  'app-gestion-reseaux',
  templateUrl: './gestion-reseaux.component.html',
  styleUrls: ['./gestion-reseaux.component.scss'],

})
export class GestionReseauxComponent implements OnInit {

  public globalParams!: GlobalParams;
  public groupForm: FormGroup = new FormGroup({});

  constructor(private popinService: PopinService,
              private router: Router,
              private route: ActivatedRoute,
              private toast: ToastService,
              private globalParamsService: GlobalParamService,
              private formBuilder: FormBuilder) {}

  ngOnInit(): void {
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

  initForm(): void {
    this.groupForm = new FormGroup({
      globalparamsId: new FormControl(this.globalParams ? this.globalParams.globalparamsId : ''),
      urlSnapchat: new FormControl(this.globalParams ? this.globalParams.urlSnapchat : ''),
      urlTelegram: new FormControl(this.globalParams ? this.globalParams.urlTelegram : ''),
      urlInstagram: new FormControl(this.globalParams ? this.globalParams.urlInstagram : ''),
      urlFacebook: new FormControl(this.globalParams ? this.globalParams.urlFacebook : ''),
    });
  }

  onSubmit(): void {
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
