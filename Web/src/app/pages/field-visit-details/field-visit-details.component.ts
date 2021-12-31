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

  fieldVisit: FieldVisit;
  title = 'My first AGM project';
  lat = 51.678418;
  lng = 7.809007;
  fieldRequests: FieldVisit[];
  counts: any[];
  valueChanged;

  constructor(private router: Router,private fieldVisitService:FieldVisitService) {
    this.fieldVisit = this.router.getCurrentNavigation().extras.state.fieldVisit;

  }
  getColor(status) {
    if (status == 'pending') return '[bg-pending]'
  }

  ngOnInit() {
    this.counts = this.fieldVisitService.getFieldVisitCountsByStatus(this.fieldVisit.id);

  }


}

