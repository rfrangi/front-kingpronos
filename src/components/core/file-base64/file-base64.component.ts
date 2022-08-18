import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'file-base64',
  template: `
<input type="file"
       hidden
       #imgFileInput
       [attr.accept]="allowedMimeTypes"
       (change)="onChange($event)"/>
<button class="valider"
        name="btn-valider"
        type="button"
        mat-button color="primary"
        (click)="imgFileInput.click()"
        [disabled]="isDisabled"
        [class]="onclass">
  {{ lblButton }}
</button>
  `,
  styleUrls: ['./file-base64.component.scss'],
})
export class FileBase64Component {

  @Input() lblButton: string = 'Changer';
  @Input() maxFileSize!: number;
  @Input() allowedExtensions!: Array<string>;
  @Input() allowedMimeTypes!: Array<string>;
  @Input() isDisabled: boolean = true;
  @Input() onclass: string = '';

  @Output() fileRead = new EventEmitter();

  constructor(private toast: ToastService) {
    this.toast = toast;
  }

  onChange(event: any): void {
    const file = event.target.files[ 0 ];
    let error = null;

    if (!file) {
      return;
    }

    const extension = file.name.split('.').reverse()[0];

    if (!this.isAllowedExtension(extension)) {
      const extensions = this.allowedExtensions.map(ext => ext.toUpperCase());
      error = `Le fichier doit être au format ${extensions.join(' ou ')}.`;
    }

    if (file.size > this.maxFileSize) {
      error = `Le fichier est trop volumineux`;
    }

    if (error !== null) {
      this.toast.error(error);
      return;
    }

    this.fileRead.emit(event);
  }

  isAllowedExtension(extension: string): boolean {
    return this.allowedExtensions.map(ext => ext.toLowerCase()).includes(extension.toLowerCase());
  }
}
