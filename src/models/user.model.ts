import {LIST_PROFIL, Profil} from './profil.model';
import {CodeVIP} from './code-vip.model';
import {dateToday} from '../utils/date-util';

export class User {

  id!: string;
  pseudonyme!: string;
  login!: string;
  profils: Array<Profil> = [];
  isEnabled: boolean = true;

  codeParrain!: string;
  codeParrainage!: string;

  expiredVIPDate: Date | undefined;

  password!: string;
  passwordConfirm!: string;

  logo!: any;
  logoFileType!: string;

  codesVIP: Array<CodeVIP>;

  isUserFB!: boolean;

  creationDate!: Date;
  lastConnectionDate!: Date;
  modificationDate!: Date;

  hasNotification!: boolean;

  constructor(data: any = {}) {
    Object.assign(this, data);
    this.profils = (data.profils || []).map((profil: any) => LIST_PROFIL[profil]);
    this.expiredVIPDate = data.expiredVIPDate ? new Date(data.expiredVIPDate) : undefined;
    this.codesVIP = data.codesVIP ? data.codesVIP.map((code: any) => new CodeVIP(code)) : [];
  }

  serialize(): any {
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

  isSamePassword(): boolean {
    return this.password === this.passwordConfirm;
  }

  hasProfilSuperAdmin(): boolean {
    return this.profils && this.profils.includes(LIST_PROFIL.SUPER_ADMIN);
  }

  hasProfilAdmin(): boolean {
    return this.profils && this.profils.includes(LIST_PROFIL.ADMIN) || this.hasProfilSuperAdmin();
  }

  hasProfilVIP(): boolean {
    return this.profils && this.profils && this.profils.includes(LIST_PROFIL.VIP);
  }

  hasVIPValid(): boolean {
    return this.profils && this.hasProfilVIP() && this.expiredVIPDate != null && (this.expiredVIPDate >= dateToday()) || this.hasProfilAdmin() || this.hasProfilSuperAdmin();
  }
}
