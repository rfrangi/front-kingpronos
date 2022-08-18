
export class Commentaire {

  creationDate!: Date;
  message!: string;
  pseudonyme!: string;
  urlPhoto !: string;

  constructor(data: any = {}) {
    Object.assign(this, data);
  }
}
