import { NgModule } from '@angular/core';


import {SharedModule} from '../shared/shared.module';
import {CommonModule} from '@angular/common';
import {ChatRoutingModule} from './chat-routing.module';
import {ChatPronosticComponent} from '../../components/chat/pronostic/chat-pronostic.component';

@NgModule({
  declarations: [
    ChatPronosticComponent

  ],
  entryComponents: [

  ],
  imports: [
    ChatRoutingModule,
    CommonModule,
    SharedModule
  ]
})
export class ChatModule { }
