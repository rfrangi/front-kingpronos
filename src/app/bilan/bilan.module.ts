import { NgModule } from '@angular/core';


import {SharedModule} from '../shared/shared.module';
import {CommonModule} from '@angular/common';
import {BilanRoutingModule} from './bilan-routing.module';
import {GestionBilanComponent} from "../../components/admin/gestion-bilan/gestion-bilan.component";
import { GoogleChartsModule } from 'angular-google-charts';

@NgModule({
  declarations: [ GestionBilanComponent ],
  exports: [
    GoogleChartsModule
  ],
  imports: [
    BilanRoutingModule,
    CommonModule,
    SharedModule
  ]
})
export class BilanModule { }
