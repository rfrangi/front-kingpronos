import {LIST_PROFIL, Profil} from './profil.model';
import {CodeVIP} from './code-vip.model';
import {dateToday} from '../utils/date-util';
import {URL_STOCKAGE} from "../utils/fetch";

export class User {

  public id!: string;
  public pseudonyme!: string;
  public login!: string;
  public profils: Array<Profil> = [];
  public isEnabled: boolean = true;

  public codeParrain!: string;
  public codeParrainage!: string;

  public expiredVIPDate: Date | undefined;

  public password!: string;
  public  passwordConfirm!: string;

  public logo!: any;
  public logoFileType!: string;

  public codesVIP: Array<CodeVIP>;

  public isUserFB!: boolean;

  public creationDate!: Date;
  public lastConnectionDate!: Date;
  public modificationDate!: Date;

  public hasNotification!: boolean;

  constructor(data: any = {}) {
    Object.assign(this, data);
    this.profils = (data.profils || []).map((profil: any) => LIST_PROFIL[profil]);
    this.expiredVIPDate = data.expiredVIPDate ? new Date(data.expiredVIPDate) : undefined;
    this.codesVIP = data.codesVIP ? data.codesVIP.map((code: any) => new CodeVIP(code)) : [];
  }

  public serialize(): any {
    return {
      id: this.id,
      pseudonyme: this.pseudonyme,
      login: this.login,
      isEnabled: this.isEnabled,
      logo: this.logo,
      logoFileType: this.logoFileType,
      codeParrain: this.codeParrain,
      codeParrainage: this.codeParrainage,
      expiredVIPDate: this.expiredVIPDate,
      password: this.password,
      profils: this.profils.map(profil => profil.code),
      codesVIP: this.codesVIP.map(code => code.seralize()),
      hasNotification: this.hasNotification
    };
  }

  public isSamePassword(): boolean {
    return this.password === this.passwordConfirm;
  }

  public hasProfilSuperAdmin(): boolean {
    return this.profils && this.profils.includes(LIST_PROFIL.SUPER_ADMIN);
  }

  public hasProfilAdmin(): boolean {
    return this.profils && this.profils.includes(LIST_PROFIL.ADMIN) || this.hasProfilSuperAdmin();
  }

  public hasProfilVIP(): boolean {
    return this.profils && this.profils && this.profils.includes(LIST_PROFIL.VIP);
  }

  public hasVIPValid(): boolean {
    return this.profils && this.hasProfilVIP() && this.expiredVIPDate != null && (this.expiredVIPDate >= dateToday()) || this.hasProfilAdmin() || this.hasProfilSuperAdmin();
  }

  public logoDataUrl(): string {
    const url = this.logo;
    return url ? URL_STOCKAGE + url : 'assets/icons/picto-user.svg';
  }
}
