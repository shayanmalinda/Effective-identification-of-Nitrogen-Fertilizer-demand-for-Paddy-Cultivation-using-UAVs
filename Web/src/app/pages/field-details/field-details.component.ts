import { FieldVisitService } from './../../services/field-visit.service';
import { FieldVisit } from '../../models/field-visit.model';
import { Component, OnInit } from '@angular/core';
import { Field } from '../../models/field.model';
import { Router } from '@angular/router';
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
  fieldRequests: FieldVisit[];
  counts: any[];
  valueChanged;

  constructor(private router: Router,private fieldVisitService:FieldVisitService) {
    this.field = this.router.getCurrentNavigation().extras.state.field;

  }
  getColor(status) {
    if (status == 'pending') return '[bg-pending]'
  }

  ngOnInit() {
    this.counts = this.fieldVisitService.getFieldVisitCountsByStatus(this.field.id);

  }


}

