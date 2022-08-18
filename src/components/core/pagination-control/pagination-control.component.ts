import {Component, Input, Output, EventEmitter} from '@angular/core';
import {PaginationService} from '../../../services/pagination.service';

@Component({
  selector: 'pagination-control',
  template: `

    <div class="pagination">
      <button mat-button
              name="btn-back"
              matTooltip="Page Précédente"
              [class.disabled]="pagination.isFirstPage"
              (click)="gotoPage(pagination.currentPage - 1)">
        <mat-icon>navigate_before</mat-icon>
      </button>
      <button mat-button
              name="btn-next"
              matTooltip="Page suivante"
              [class.disabled]="pagination.isLastPage"
              (click)="gotoPage(pagination.currentPage + 1)">
        <mat-icon>navigate_next</mat-icon>
      </button>
    </div>
<!--
<p>
    <span class="result">
        {{ pagination.numFirstItem }} à {{ pagination.numLastItem }}
        sur {{ pagination.nbItems }}
    </span>
    <mat-icon color="primary"
              [class.disabled]="disabled || pagination.isFirstPage"
              matTooltip="Première page"
              (click)="gotoPage(1)">
        skip_previous
    </mat-icon>
    <mat-icon color="primary"
              matTooltip="Page précédente"
              [class.disabled]="disabled ||  pagination.isFirstPage"
              (click)="gotoPage(pagination.currentPage - 1)">
        navigate_before
    </mat-icon>
    <select name="select" (change)="gotoPage($event.target.value)">
        <option *ngFor="let pageNumber of pagination.pageList"
                [value]="pageNumber"
                matTooltip="Dernière page"
                [selected]="pageNumber === pagination.currentPage"
        >{{pageNumber}}</option>
    </select>-->
    <!--<mat-form-field>
        <mat-select name="select" [(ngModel)]="pagination.currentPage" (change)="gotoPage($event.target.value)" color="primary">
            <mat-option *ngFor="let pageNumber of pagination.pageList" [value]="pageNumber"
                        [selected]="pageNumber === pagination.currentPage">
                {{pageNumber}}
            </mat-option>
        </mat-select>
    </mat-form-field>
    <span>/ {{ pagination.nbPages }}</span>
    <mat-icon color="primary"
              [class.disabled]="disabled || pagination.isLastPage"
              matTooltip="Page suivante"
              (click)="gotoPage(pagination.currentPage + 1)">
      navigate_next
    </mat-icon>

    <mat-icon color="primary"
              (click)="gotoPage(pagination.nbPages)"
              [class.disabled]="disabled || pagination.isLastPage">
      skip_next
    </mat-icon>

    </p>-->,
`,
  styleUrls: ['./pagination-control.component.scss'],

})
export class PaginationControlComponent {

  @Input() pagination!: PaginationService;
  @Input() disabled: boolean = false;

  @Output() onPageChange = new EventEmitter();

  gotoPage(page: number): void {
    if (page >= 1 && page <= this.pagination.nbPages) {
      this.pagination.currentPage = page;
      this.onPageChange.emit({ page, control: this });
    }
  }

}
