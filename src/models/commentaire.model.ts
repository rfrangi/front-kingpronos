
export class Commentaire {

  public id!: string;
  public creationDate!: Date;
  public message!: string;
  public pseudonyme!: string;
  public urlPhoto !: string;

  constructor(data: any = {}) {
    Object.assign(this, data);
  }
}
