import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSliderModule} from '@angular/material/slider';
import { MatDialogModule } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldControl, MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { MatRadioModule } from '@angular/material/radio';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatCardModule} from '@angular/material/card';
// import * as Material from '@angular/material';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatSliderModule,
    MatDialogModule,
    MatIconModule,
    MatTableModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatInputModule,
    MatSortModule,
    MatPaginatorModule,
    MatRadioModule,
    MatDatepickerModule,
    MatCardModule,
  ],
  exports: [
    MatSliderModule,
    MatDialogModule,
    MatIconModule,
    MatTableModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatInputModule,
    MatSortModule,
    MatPaginatorModule,
    MatRadioModule,
    MatDatepickerModule,
    MatCardModule,
  ]
})
export class MaterialModule { }
