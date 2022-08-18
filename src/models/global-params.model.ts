import { Bookmaker } from './bookmaker.model';

export class GlobalParams {

  public globalparamsId!: string;
  public mail!: string;
  public mailCoorporation!: string;
  public bankrollDepart!: number;
  public  bankrollCurrent!: number;

  public urlSnapchat!: string;
  public urlFacebook!: string;
  public urlTelegram!: string;
  public urlInstagram!: string;

  public modificationDate!: Date;
  public creationDate!: Date;

  public bookmakers: Array<Bookmaker> = [];

  constructor(data: any = {}) {
    Object.assign(this, data);
    this.bookmakers = data.bookmakers ? data.bookmakers.map((obj: any) => new Bookmaker(obj)) : [];
  }

  public hasReseaux(): boolean {
    return !!(this.urlSnapchat || this.urlFacebook || this.urlInstagram || this.urlInstagram);
  }

  public serialize(): any{
    return {
      globalparamsId: this.globalparamsId,
      mail: this.mail,
      mailCoorporation: this.mailCoorporation,
      creationDate: this.creationDate,
      modificationDate: this.modificationDate,
      bankrollDepart: this.bankrollDepart,
      bankrollCurrent: this.bankrollCurrent,
      urlSnapchat: this.urlSnapchat,
      urlTelegram: this.urlTelegram,
      urlInstagram: this.urlInstagram,
      urlFacebook: this.urlFacebook,
      bookmakers: this.bookmakers.map(boomaker => boomaker.serialize())
    };
  }
}
