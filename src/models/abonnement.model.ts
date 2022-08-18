export class Abonnement {

  id!: string;
  label!: string;
  description!: string;
  price!: number;
  nbJour!: number;

  constructor(data: any = {}) {
    Object.assign(this, data);
    this.price = data.price ? data.price.toFixed(2) : undefined;
  }
}
