import { FieldRequest } from './../../models/field-request.model';
import { Component, OnInit } from '@angular/core';
import { Field } from '../../models/field.model';
import { Router } from '@angular/router';
import { FieldRequestService } from '../../services/field-request.service';
import { reduce } from 'rxjs-compat/operator/reduce';

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
  fieldRequests: FieldRequest[];
  counts: any[];
  valueChanged;

  constructor(private router: Router, private fieldRequestService: FieldRequestService) {
    this.field = this.router.getCurrentNavigation().extras.state.field;

  }
  getColor(status) {
    if (status == 'pending') return '[bg-pending]'
  }

  ngOnInit() {
    this.counts = this.fieldRequestService.getFieldVisitCountsByStatus(this.field.id);

  }


}

