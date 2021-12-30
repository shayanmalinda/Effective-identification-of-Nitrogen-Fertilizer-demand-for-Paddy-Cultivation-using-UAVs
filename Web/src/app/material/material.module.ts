import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSliderModule} from '@angular/material/slider';
import { MatDialogModule } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
// import * as Material from '@angular/material';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatSliderModule,
    MatDialogModule,
    MatIconModule,
  ],
  exports: [
    MatSliderModule,
    MatDialogModule,
    MatIconModule,
  ]
})
export class MaterialModule { }
