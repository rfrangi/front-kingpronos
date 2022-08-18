
export class Bookmaker {

  id!: string;
  name!: string;
  url!: string;
  urlLogo!: string;
  disabled!: boolean;
  description!: string;

  constructor(data: any = {}) {
    Object.assign(this, data);
  }

  serialize(): any {
    return {
      id: this.id,
      name: this.name,
      url: this.url,
      urlLogo: this.urlLogo,
      disabled: this.disabled,
      description: this.description
    };
  }
}
