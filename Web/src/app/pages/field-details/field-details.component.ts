import { Component, OnInit } from '@angular/core';
import { Field } from '../../models/field.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-field-details',
  templateUrl: './field-details.component.html',
  styleUrls: ['./field-details.component.css']
})
export class FieldDetailsComponent implements OnInit {

  field: Field;
  title = 'My first AGM project';
  lat = 51.678418;
  lng = 7.809007;

  constructor(private router: Router) {
    this.field = this.router.getCurrentNavigation().extras.state.field;

  }

  ngOnInit() {

  }
 

}

