export class PronoStatus {

  code!: string;
  label!: string;
  img!: string;
  text!: string;
  textSuccess!: string;

  constructor(data: any = {}) {
    Object.assign(this, data);
  }
}

export const PRONO_STATUS: any = {
  IN_PROGRESS: new PronoStatus({
    code: 'IN_PROGRESS',
    label: 'En cours',
    img: ''
  }),
  SUCCESS: new PronoStatus({
    code: 'SUCCESS',
    label: 'Gagant',
    img: 'assets/icons/icon_success.svg',
    text: 'Le pronostic est-il gagant ?',
    textSuccess: 'Le pronostic est gagné'

  }),
  FAILURE: new PronoStatus({
    code: 'FAILURE',
    label: 'Perdant',
    img: 'assets/icons/icon_echec.svg',
    text: 'Le pronostic est-il perdant ?',
    textSuccess: 'Le pronostic est perdu'

  }),
  CANCEL: new PronoStatus({
    code: 'CANCEL',
    label: 'Annuler',
    img: '',
    text: 'Le pronostic est-il abandonné ?',
    textSuccess: 'Le pronostic est adondonné'
  })
};

export const LIST_PRONO_STATUS: Array<PronoStatus> = [
  PRONO_STATUS.IN_PROGRESS,
  PRONO_STATUS.CANCEL,
  PRONO_STATUS.FAILURE,
  PRONO_STATUS.SUCCESS
];
