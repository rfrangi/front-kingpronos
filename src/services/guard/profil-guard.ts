import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot } from '@angular/router';

import {TokenStorageService} from '../token-storage.service';

@Injectable({
  providedIn: 'root'
})
export class ProfilGuard {

  constructor(private tokenStorageService: TokenStorageService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
  // pas de session active
  if (!this.tokenStorageService.isValid()) {
    this.router.navigateByUrl('login');
    return false;
  }
  //return this.tokenStorageService?.getUser()?.profils.some(profil => route?.routeConfig?.data?.profils.includes(profil)) as boolean;

  return true
  }
}
