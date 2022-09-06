import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';

import {MatDividerModule} from '@angular/material/divider';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatMenuModule} from '@angular/material/menu';
import {MatSelectModule} from '@angular/material/select';
import {MatTableModule} from '@angular/material/table';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatButtonModule} from '@angular/material/button';
import {MatRadioModule} from '@angular/material/radio';
import {MatDialogModule} from '@angular/material/dialog';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatSliderModule} from '@angular/material/slider';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatCardModule} from '@angular/material/card';
import {MatToolbarModule} from '@angular/material/toolbar';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatDatepickerModule} from '@angular/material/datepicker';

import {DatePipe} from '../../pipes/date';

import {FileBase64Component} from '../../components/core/file-base64/file-base64.component';
import {PaginationControlComponent} from '../../components/core/pagination-control/pagination-control.component';
import {ListPronoComponent} from '../../components/prono/list-prono/list-prono.component';
import {DetailsMatchComponent} from '../../components/prono/details-match/details-match.component';
import {PopinPseudonymeComponent} from '../../components/core/popin/popin-pseudonyme/popin-pseudonyme.component';
import {MyAccountFormComponent} from '../../components/gestion-user/my-account/my-account-form.component';
import {ReseauxSociauxComponent} from '../../components/core/reseaux-sociaux/reseaux-sociaux.component';
import {ListAbonnementComponent} from '../../components/shared/list-abonnement/list-abonnement.component';

import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';

import { GoogleChartsModule } from 'angular-google-charts';
import {DetailsBookmakerComponent} from "../../components/bookmaker/details-bookmaker/details-bookmaker.component";
import {PopinCalculMiseComponent} from "../../components/core/popin/popin-calcul-mise/popin-calcul-mise.component";
import {PopinCrudAbonnementComponent} from "../../components/admin/trest/popin-crud-abonnement.component";

const components = [
  FileBase64Component,
  PaginationControlComponent,
  ListPronoComponent,
  MyAccountFormComponent,
  ReseauxSociauxComponent,
  DetailsMatchComponent,
  ListAbonnementComponent,
  DetailsBookmakerComponent,
];

const materials = [
  MatAutocompleteModule,
  MatTableModule,
  ReactiveFormsModule,
  MatSliderModule,
  MatSnackBarModule,
  MatFormFieldModule,
  MatDividerModule,
  MatSelectModule,
  MatMenuModule,
  MatInputModule,
  MatButtonToggleModule,
  MatSlideToggleModule,
  MatExpansionModule,
  MatToolbarModule,
  MatCardModule,
  MatButtonModule,
  MatIconModule,
  MatTooltipModule,
  MatRadioModule,
  MatProgressSpinnerModule,
  MatDialogModule,
  MatCheckboxModule,
  MatPaginatorModule,
  MatDatepickerModule,
  MatNativeDateModule,
];

const pipes = [
  DatePipe
]

const popins = [
  PopinPseudonymeComponent,
  PopinCalculMiseComponent,
  PopinCrudAbonnementComponent
];
@NgModule({
  declarations: [
    ...components,
    ...pipes,
    ...popins
  ],
  entryComponents: [ PopinPseudonymeComponent ],
  exports: [
    ...materials,
    ...components,
    ...popins,
    ...pipes,
    FormsModule,
    GoogleChartsModule
  ],
  imports: [
    ...materials,
    CommonModule,
    FormsModule,
    GoogleChartsModule
  ],
  providers: [
    MatDatepickerModule,
    { provide: MAT_DATE_LOCALE, useValue: 'fr-FR' }
  ]
})
export class SharedModule { }
