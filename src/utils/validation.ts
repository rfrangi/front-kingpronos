import { FormControl, FormGroupDirective, NgForm, FormGroup } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

export const VALIDATION_ERROR_TYPES = [ 'required', 'format', 'pattern' ];

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

export function hasError(formGroup: FormGroup, controlName: string, errorName: string): any {
  return formGroup.controls[controlName].hasError(errorName);
}

export function validateForm(params: any): boolean {
  params = Object.assign({
    selector: 'form',
    types: VALIDATION_ERROR_TYPES
  }, params);

  const form = document.querySelector(params.selector);
  const errorsToMatch = params.types.map((type: any) => `.error.${type}`).join(', ');
  const errors = Array.from(form.querySelectorAll(errorsToMatch));
  const isValid = (errors.length === 0);

  if (!isValid) {
    form.classList.add('hide-validation-errors');
    for (const type of VALIDATION_ERROR_TYPES) {
      form.classList.toggle(`show-${type}-errors`, params.types.includes(type));
    }
  }

  return isValid;
}
export const VALIDATION_ERROR = `Un des champs requis n'a pas été renseigné ou ne respecte pas le format attendu.`;
export const CONNECTION_ERROR = `Erreur : aucun accès internet`;
