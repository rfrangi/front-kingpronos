import {Equipe} from './equipe.model';
import {Categorie, CATEGORIES} from './categorie.model';

export class Match {

  matchId!: string;

  categorie: Categorie;

  equipe1: Equipe | null;
  equipe2: Equipe | null;

  scoreEq1!: number;
  scoreEq2!: number;

  titre!: string;

  cote!: number;

  debutDate!: Date;
  modificationDate!: Date;
  creationDate!: Date;

  constructor(data: any = {}) {
    Object.assign(this, data);
    this.categorie = data.categorie ? CATEGORIES[data.categorie] : CATEGORIES.FOOTBALL;
    this.equipe1 =  data.equipe1 ? this.categorie.getEquipe(data.equipe1) : null;
    this.equipe2 =  data.equipe2 ? this.categorie.getEquipe(data.equipe2) : null;
  }

  serialize(): any {
    return {
      matchId: this.matchId,
      cote: this.cote,
      categorie: this.categorie.code,
      equipe1: this.equipe1?.code,
      equipe2: this.equipe2?.code,
      scoreEq1: this.scoreEq1,
      scoreEq2: this.scoreEq2,
      titre: this.titre,
      debutDate: this.debutDate,
      modificationDate: this.modificationDate
    }
  }
}
