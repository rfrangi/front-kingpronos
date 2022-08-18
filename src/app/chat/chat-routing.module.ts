import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import {AuthGuard} from '../../services/guard/auth';
import {ChatPronosticComponent} from '../../components/chat/pronostic/chat-pronostic.component';

export const routes: Routes = [
  { path: '', data: { animation: 'chatPage'}, canActivate: [ AuthGuard ],
    children: [
      {
        path: 'pronostic/:idpronostic',
        component: ChatPronosticComponent,
        data: { animation: 'ChatPronosticPage' },
      }
    ]
  },
]

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class ChatRoutingModule { }
