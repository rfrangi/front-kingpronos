import { Injectable } from '@angular/core';
import {User} from '../models/user.model';

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-gestion-user';

const TOKEN_KEY_FB = 'auth-token-fb';
const USER_KEY_FB = 'auth-gestion-user-fb';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {

  user!: User;

  constructor() { }

  signOut(): void {
    window.sessionStorage.clear();
  }

  public saveToken(token: string): void {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);
  }

  public saveTokenFB(token: string): void {
    window.sessionStorage.removeItem(TOKEN_KEY_FB);
    window.sessionStorage.setItem(TOKEN_KEY_FB, token);
  }

  public getTokenFB(): string | null {
    return sessionStorage.getItem(TOKEN_KEY_FB);
  }

  public getToken(): string | null {
    return sessionStorage.getItem(TOKEN_KEY);
  }

  public saveUser(user: User): void {
    this.user = user;
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user.serialize()));
  }

  public isValid(): boolean {
    return this.getToken() != null;
  }

  public getUser(): User | null {
    if (this.user) {
      return this.user;
    }
    return sessionStorage.getItem(USER_KEY) ? new User(JSON.parse(sessionStorage?.getItem(USER_KEY) || '')) : null;
  }
}
