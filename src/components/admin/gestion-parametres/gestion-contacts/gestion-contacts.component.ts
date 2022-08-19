import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

import {ToastService} from '../../../../services/toast.service';
import {PopinService} from '../../../../services/popin.service';
import {GlobalParamService} from '../../../../services/global-param.service';
import {GlobalParams} from "../../../../models/global-params.model";
import {MyErrorStateMatcher} from "../../../../utils/validation";

@Component({
  selector:  'app-gestion-contacts',
  templateUrl: './gestion-contacts.component.html',
  styleUrls: ['./gestion-contacts.component.scss'],

})
export class GestionContactsComponent implements OnInit {


  public globalParams!: GlobalParams;
  public groupForm: FormGroup = new FormGroup({});
  matcher = new MyErrorStateMatcher();
  step = 0;
  bookmakers = new FormArray([]);

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

  public hasError = (controlName: string, errorName: string) => {
    return this.groupForm.controls[controlName].hasError(errorName);
  }

  public initForm(): void {
    this.groupForm = new FormGroup({
      globalparamsId: new FormControl(this.globalParams ? this.globalParams.globalparamsId : ''),
      mail: new FormControl(this.globalParams ? this.globalParams.mail : '',
        [ Validators.required, Validators.email ]),
      mailCoorporation: new FormControl(this.globalParams ? this.globalParams.mailCoorporation : '',
        [ Validators.required, Validators.email ]),
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
