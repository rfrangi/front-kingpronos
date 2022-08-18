
export class PaginationService {

  currentPage = 0;
  nbPages!: number;
  nbItems!: number;
  nbItemsPerPage!: number;

  constructor(paginationData: any = {}) {
    if (paginationData) {
      this.currentPage = paginationData.number + 1;
      this.nbPages = paginationData.totalPages;
      this.nbItems = paginationData.totalElements;
      this.nbItemsPerPage = paginationData.size;
    }
  }

  reset(): void {
    this.currentPage = 1;
  }

  get numFirstItem(): number {
    return (this.currentPage - 1) * this.nbItemsPerPage + 1;
  }

  get numLastItem(): number {
      return this.isLastPage ? this.nbItems :  this.currentPage * this.nbItemsPerPage;
  }

  get isFirstPage(): boolean {
    return this.currentPage <= 1;
  }

  get isLastPage(): boolean {
    return this.currentPage >= this.nbPages;
  }

  get pageList(): Array<any> {
    // @ts-ignore
    return Array(this.nbPages).fill().map((_, i) => i + 1);
  }

  get urlParams(): object {
    return {
      page: this.currentPage
    };
  }
}


