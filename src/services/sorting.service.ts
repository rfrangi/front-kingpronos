
export class SortingService {
  sortBy!: string;
  sortOrder!: string; // ascending or descending

  constructor(data: any = {}) {
    Object.assign(this, data);
  }
  get urlParams(): any {

    return [ 'sortBy', 'sortOrder' ]
      // @ts-ignore
      .filter((p: string) => this[ p ] != null)
      // @ts-ignore
      .reduce((params, p) => { params[ p ] = this[ p ]; return params; }, {});
  }

  // @ts-ignore
  setParams({ sortBy, sortOrder }): void {
    if (sortBy) {
      this.sortBy = sortBy;
    }
    if (sortOrder) {
      this.sortOrder = sortOrder;
    }
  }
}
