export class Privacy {

  code!: string;
  label!: string;
  img!: string;

  constructor(data: any = {}) {
    Object.assign(this, data);
  }
}

export const PRIVACYS: any = {
  PUBLIC: new Privacy({
    code: 'PUBLIC',
    label: 'Public',
    img: ''
  }),
  PRIVE: new Privacy({
    code: 'PRIVE',
    label: 'Privée',
    img: ''
  }),
  MONTANTE: new Privacy({
    code: 'MONTANTE',
    label: 'Montante',
    img: ''
  }),
  FUN: new Privacy({
  code: 'FUN',
  label: 'Fun',
  img: ''
})
};

export const LIST_PRIVACY: Array<Privacy> = [ PRIVACYS.PUBLIC, PRIVACYS.PRIVE ];
