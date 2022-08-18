import {Injectable} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import { ComponentType } from '@angular/cdk/portal';

import {PopinMessageDuringComponent} from '../components/core/popin/popin-message-during/popin-message-during.component';

import {Observable} from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PopinService {

  constructor(public dialog: MatDialog) {}

  showLoader(message: string = `Chargement des données`): void {
    this.dialog.open(PopinMessageDuringComponent, {width: `auto`, data: { message }});
  }

  closeLoader(): void {
    this.dialog.closeAll();
  }

  openPopin<T>(popinComponent: ComponentType<T>, config?: any): Observable<any> {
    return this.dialog.open(popinComponent, config).afterClosed();
  }
}
