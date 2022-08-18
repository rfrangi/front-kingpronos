import {Injectable} from '@angular/core';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar, MatSnackBarHorizontalPosition } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private _SNACKBAR: MatSnackBar) {}

  openSnackBar(message: string, action: string = '', duration: number = 2500): MatSnackBarRef<SimpleSnackBar> {
    return this._SNACKBAR.open(message, action, {duration});
  }

  error(message: string, action: string = ``, duration: number = 2500): MatSnackBarRef<SimpleSnackBar> {
    return this._SNACKBAR.open(message, action, {
      duration,
        panelClass: ['error-snackbar']
    });
  }

  warning(message: string, action: string = ``, duration: number = 2500): MatSnackBarRef<SimpleSnackBar> {
    return this._SNACKBAR.open(message, action, {
      duration,
      panelClass: ['warning-snackbar']
    });
  }

  info(message: string = 'Fonctionnalité non disponible', action: string = ``, duration: number = 2500): MatSnackBarRef<SimpleSnackBar> {
   return this._SNACKBAR.open(message, action, {
      duration,
      panelClass: ['info-snackbar']
    });
  }

  success(message: string, action: string = ``, duration: number = 2500): MatSnackBarRef<SimpleSnackBar> {
    return this._SNACKBAR.open(message, action, {
      duration,
      panelClass: ['success-snackbar']
    });
  }

  genericError(error: Error, title = 'Erreur technique', shouldPropagateError = true): void {
    if (error != null) {
      this.error(title);
      if (shouldPropagateError) {
        throw error; // renvoie l'erreur pour stopper les then() suivants
      }
    }
  }
}
