import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import {TokenStorageService} from '../token-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthLoginGuard {

  constructor(private tokenStorageService: TokenStorageService, private router: Router) {}

  canActivate(): boolean {
    if (this.tokenStorageService.isValid()) {
      this.router.navigateByUrl(`home`);
    }
    return true;
  }

  canActivateChild(): boolean {
    return this.canActivate();
  }

}
