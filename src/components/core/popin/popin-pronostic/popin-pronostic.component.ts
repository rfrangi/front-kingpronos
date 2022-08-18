import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatDialog} from '@angular/material/dialog';

import { Pronostic } from 'src/models/pronostic.model';

export interface DialogData {
  pronostics: Array<Pronostic>;
}

@Component({
  selector: 'popin-pronostic',
  template: `
  <list-prono [pronostics]="data.pronostics"></list-prono>
   `,
  styleUrls: ['./popin-pronostic.component.scss'],
})
export class PopinPronosticComponent {


  constructor(public dialog: MatDialog,
              public dialogRef: MatDialogRef<PopinPronosticComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  cancel(): void {
    this.dialogRef.close();
  }
}

