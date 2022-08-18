
import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';


export interface DialogData {
  animal: string;
  name: string;
  message: string;
}

@Component({
  selector: 'popin-message-during',
  template: `
<span>
   <mat-progress-spinner color="accent" mode="indeterminate" value="50" diameter="20"></mat-progress-spinner>
  {{data.message}}
</span>
  `,
  styleUrls: ['./popin-message-during.component.scss'],
})
export class PopinMessageDuringComponent {

  constructor(
    public dialogRef: MatDialogRef<PopinMessageDuringComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
