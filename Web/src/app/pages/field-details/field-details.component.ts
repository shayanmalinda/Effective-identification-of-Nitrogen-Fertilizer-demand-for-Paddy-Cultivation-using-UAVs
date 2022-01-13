import { FieldTemp } from './../../models/field.model';
import { FieldVisitService } from './../../services/field-visit.service';
import { FieldVisit } from '../../models/field-visit.model';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-field-details',
  templateUrl: './field-details.component.html',
  styleUrls: ['./field-details.component.css']
})
export class FieldDetailsComponent implements OnInit {

  field: FieldTemp;
  title = 'My first AGM project';
  lat = 51.678418;
  lng = 7.809007;
  fieldRequests: FieldVisit[];
  counts: any[];
  valueChanged;

  constructor(private router: Router, private fieldVisitService: FieldVisitService) {
    this.field = this.router.getCurrentNavigation().extras.state.field;

  }
  getColor(status) {
    if (status == 'pending') return '[bg-pending]'
  }
  viewFieldVisits() {
    // this.router.navigate(['/field-visits']);
    this.router.navigate(['/field-visits'], { state: { fieldId: this.field.id ,type:'visit'} });
  }
  viewFieldRequests() {
    // this.router.navigate(['/field-visits']);
    this.router.navigate(['/field-visits'], { state: { fieldId: this.field.id ,type:'request'} });
  }
  ngOnInit() {
    this.counts = [];
    let countsTemp: { [key: string]: number } = {
      pending: 0,
      confirmed: 0,
      declined: 0,
      processing: 0,
      completed: 0,
    }
    let fieldvisits: FieldVisit[];
    this.fieldVisitService.getFieldVisitRequests(this.field.id).subscribe(data => {
      fieldvisits = data.map(a => {
        return {
          ...a as FieldVisit
        }
      })
      fieldvisits.forEach(visit => {
        countsTemp[visit.status]++;
      })
      console.log('-----------------------------------------')
      Object.keys(countsTemp).forEach(key => {

        if (countsTemp[key] != 0)
          this.counts.push({
            status: key,
            count: countsTemp[key]
          })
      });

    });
  }


}

