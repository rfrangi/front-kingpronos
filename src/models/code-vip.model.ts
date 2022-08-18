export class CodeVIP {

  titre!: string;
  codeId!: string;
  code!: string;
  nbJoursVIP!: number;
  isEnabled!: boolean;

  constructor(data: any = {}) {
    Object.assign(this, data);
    this.isEnabled =  data.enabled || false;
  }

  seralize(): any {
    return {
      code: this.code,
      enabled: this.isEnabled,
      codeId: this.codeId,
      nbJoursVIP: this.nbJoursVIP,
      titre: this.titre
    };
  }
}
