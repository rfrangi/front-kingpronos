
import {Component, EventEmitter, Inject, OnInit, Output} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormGroup, Validators, FormControl} from '@angular/forms';

import {Bookmaker} from "../../../../../models/bookmaker.model";

export interface DialogData {
  bookmaker: Bookmaker;
  confirm: string;
}

@Component({
  selector: 'popin-details-bookmakers',
  templateUrl: './popin-details-bookmaker.component.html',
  styleUrls: ['./popin-details-bookmaker.component.scss'],
})
export class PopinDetailsBookmakerComponent implements OnInit {

  bookmakerForm!: FormGroup;

  constructor(
              public dialogRef: MatDialogRef<PopinDetailsBookmakerComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  ngOnInit(): void {
    this.bookmakerForm = new FormGroup({
      id: new FormControl(this.data && this.data.bookmaker ? this.data.bookmaker.id : undefined),
      name: new FormControl(this.data && this.data.bookmaker ? this.data.bookmaker.name : '', [Validators.required]),
      description: new FormControl(this.data && this.data.bookmaker.description ?
        this.data.bookmaker.description : `Accès à l\'espace VIP (pronostics, analyse, gestion de bankroll)`,
        [Validators.required]),
      url: new FormControl(this.data && this.data.bookmaker.url ? this.data.bookmaker.url : '', [Validators.required]),
      urlLogo: new FormControl(this.data && this.data.bookmaker.urlLogo ? this.data.bookmaker.urlLogo : '', [Validators.required])
    });
  }

  cancel(): void {
    const result = { confirm: false, bookmaker: null}
    this.dialogRef.close(result);
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.bookmakerForm.controls[controlName].hasError(errorName);
  }

  submit(): void {
    if (this.bookmakerForm.valid) {
      const result = { confirm: true, bookmaker: this.bookmakerForm.value}
      this.dialogRef.close(result);
    }
  }
}
