
export class Profil {

  id!: string;
  code!: string;
  label!: string;
  img!: string;

  constructor(data: any = {}) {
      Object.assign(this, data);
  }
}

export const LIST_PROFIL: any = {
  PUBLIC: new Profil({code: `PUBLIC`, label: `Public`, img: 'assets/icons/picto-public.svg'}),
  VIP: new Profil({code: `VIP`, label: `VIP`, img: 'assets/icons/picto-vip.svg'}),
  ADMIN: new Profil({code: `ADMIN`, label: `Pronostiqueur`, img: 'assets/icons/picto-admin.svg'}),
  SUPER_ADMIN: new Profil({code: `SUPER_ADMIN`, label: `Administrateur`, img: 'assets/icons/picto-super-admin.svg'}),
};

export const ARRAY_LIST_PROFIL = [LIST_PROFIL.PUBLIC, LIST_PROFIL.VIP, LIST_PROFIL.ADMIN, LIST_PROFIL.SUPER_ADMIN ];
