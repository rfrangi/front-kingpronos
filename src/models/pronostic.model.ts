import {Privacy, PRIVACYS} from './pronostic-privacy.model';
import {Match} from './match.model';
import { PRONO_STATUS} from './pronostic-status.model';
import {Categorie} from "./categorie.model";

export class Pronostic {

  id!: string;

  creationDate!: Date;
  modificationDate!: Date;

  description!: string;

  coteTotal!: number;
  mise!: number;

  status;
  privacy: Privacy;

  matchs: Array<Match> = [];
  bankroll!: number;

  urlImage!: string;

  fun!: boolean;

  constructor(data: any = {}) {
    Object.assign(this, data);
    this.privacy = data.privacy ? PRIVACYS[data.privacy] : PRIVACYS.PRIVE;
    this.status = data.status ? PRONO_STATUS[data.status] : PRONO_STATUS.IN_PROGRESS;
    this.matchs = data.matchs ? data.matchs.map((match: any) => new Match(match)) : [];
    this.creationDate = data.creationDate ? new Date(data.creationDate) : new Date();
  }

  serialize(): any {
    this.coteTotal = this.calculCoteTotal;
    return {
      id: this.id,
      creationDate: this.creationDate,
      matchs: this.matchs.map(match => match.serialize()),
      modificationDate: this.modificationDate,
      description: this.description,
      coteTotal: this.coteTotal,
      mise: this.mise,
      status: this.status ? this.status.code : PRONO_STATUS.IN_PROGRESS,
      privacy: this.privacy.code,
      bankroll: this.bankroll,
      urlImage: this.urlImage,
      fun: this.fun
    };
  }

  getLabelGain(): string {
    switch (this.status) {
      case PRONO_STATUS.IN_PROGRESS:
        return `Bénéfice potentiel: + `;
      case PRONO_STATUS.FAILURE:
        return `Perte: `;
      case PRONO_STATUS.SUCCESS:
        return `Bénéfice: + `;
      case PRONO_STATUS.CANCEL:
        return `Aucun bénéfice, aucune perte`;
      default:
        return ``;
    }
  }

  getCategories(): Array<Categorie> {
    return Array.from(new Set(this.matchs.map(match => match.categorie)));
  }

  get gain(): number {
    const miseRelle = this.bankroll * (this.mise / 100);
    if (this.status === PRONO_STATUS.SUCCESS || this.status === PRONO_STATUS.IN_PROGRESS) {
      // @ts-ignore
      return this.mise ? (((miseRelle * this.calculCoteTotal) - miseRelle).toFixed(2)) : 0;
    } else if (this.status === PRONO_STATUS.FAILURE) {
      // @ts-ignore
      return this.mise ? - miseRelle.toFixed(2) : 0;
    }
    return 0;
  }

  calculGainWithBankroll(bankroll: number): number {
    const miseRelle = bankroll * (this.mise / 100);
    if (this.status === PRONO_STATUS.SUCCESS || this.status === PRONO_STATUS.IN_PROGRESS)
      // @ts-ignore
      return this.mise ? ((miseRelle * this.calculCoteTotal) - miseRelle).toFixed(2) : 0;
    else if (this.status === PRONO_STATUS.FAILURE) {
      // @ts-ignore
      return this.mise ? - miseRelle.toFixed(2) : 0;
    }
    return 0;
  }

  get calculCoteTotal(): any {
      return this.matchs.map((match ) => match.cote).reduce( (a, b) => a * b, 1 ).toFixed(2) || 0;
  }
}
