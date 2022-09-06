import { NgModule } from '@angular/core';


import {SharedModule} from '../shared/shared.module';
import {CommonModule} from '@angular/common';
import {BookmakersRoutingModule} from './bookmakers-routing.module';
import { NgxPayPalModule } from 'ngx-paypal';
import {ListBookmakerComponent} from "../../components/bookmaker/list-bookmaker/list-bookmaker.component";

@NgModule({
  declarations: [ ListBookmakerComponent ],
  imports: [
    BookmakersRoutingModule,
    CommonModule,
    SharedModule,
    NgxPayPalModule
  ]
})
export class BookmakersModule { }
