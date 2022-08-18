import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import {TokenStorageService} from '../token-storage.service';

@Injectable({providedIn: 'root'})
export class AuthGuard {

  constructor(private tokenStorage: TokenStorageService, private router: Router) {}

  canActivate(): boolean {
    if (this.tokenStorage.isValid()) {
      return true;
    }
    this.router.navigateByUrl(`login`);
    return false;
  }

  canActivateChild(): boolean {
  return this.canActivate();
  }
}
