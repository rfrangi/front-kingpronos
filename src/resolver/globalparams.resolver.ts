import { Injectable } from "@angular/core";
import { Resolve } from "@angular/router";

import { Observable } from "rxjs";

import {GlobalParams} from '../models/global-params.model';

import {GlobalParamService} from '../services/global-param.service';
import {PopinService} from '../services/popin.service';

@Injectable({ providedIn: 'root' })
export class GlobalparamResolver implements Resolve<GlobalParams> {

  constructor(private globalParamService: GlobalParamService) {}

  resolve(): Observable<GlobalParams> {
    return this.globalParamService.get();
  }
}
