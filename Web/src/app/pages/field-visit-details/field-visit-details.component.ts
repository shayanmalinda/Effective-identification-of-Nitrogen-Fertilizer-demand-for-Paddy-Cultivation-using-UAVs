import { FieldVisitTemp } from './../../models/field-visit.model';
import { FieldVisitService } from '../../services/field-visit.service';
import { FieldVisit } from '../../models/field-visit.model';
import { Component, OnInit } from '@angular/core';
import { Field } from '../../models/field.model';
import { Router } from '@angular/router';
import { reduce } from 'rxjs-compat/operator/reduce';

@Component({
  selector: 'app-field-visit-details',
  templateUrl: './field-visit-details.component.html',
  styleUrls: ['./field-visit-details.component.css']
})
export class FieldVisitDetailsComponent implements OnInit {

  fieldVisit: FieldVisitTemp;
  title = 'My first AGM project';
  lat = 51.678418;
  lng = 7.809007;
  fieldRequests: FieldVisitTemp[];
  counts;
  valueChanged;
  id: string;

  constructor(private router: Router, private fieldVisitService: FieldVisitService) {
    this.fieldVisit = this.router.getCurrentNavigation().extras.state.fieldVisit;

    this.id = this.router.getCurrentNavigation().extras.state.fieldVisit.id;

  }
  getColor(status) {
    if (status == 'pending') return '[bg-pending]'
  }

  ngOnInit() {
    // this.counts = this.fieldVisitService.getFieldVisitCountsByStatus(this.id);//changes

  }


}


