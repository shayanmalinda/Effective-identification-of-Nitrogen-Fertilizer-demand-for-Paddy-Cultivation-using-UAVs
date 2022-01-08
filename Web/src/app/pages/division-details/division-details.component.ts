import { FieldTemp } from './../../models/field.model';
import { FieldService } from 'app/services/field.service';
import { UserService } from 'app/services/user.service';
import { UserTemp } from './../../models/user.model';
import { FieldVisitService } from '../../services/field-visit.service';
import { FieldVisit } from '../../models/field-visit.model';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-division-details',
  templateUrl: './division-details.component.html',
  styleUrls: ['./division-details.component.css']
})
export class DivisionsDetailsComponent implements OnInit {

  field: FieldTemp;
  title = 'My first AGM project';
  lat = 51.678418;
  lng = 7.809007;
  fieldRequests: FieldVisit[];
  counts: any[];
  valueChanged;
  user: UserTemp;
  farmerCount = 0;
  fieldCount = 0;
  fields: FieldTemp[];
  fieldVisitCount = 0;


  constructor(private router: Router, private fieldVisitService: FieldVisitService, private fieldService: FieldService, private userService: UserService) {
    this.user = this.router.getCurrentNavigation().extras.state.user;
    console.log(this.user)

  }
  getColor(status) {
    if (status == 'pending') return '[bg-pending]'
  }
  viewFieldVisits() {
    // this.router.navigate(['/field-visits']);
    this.router.navigate(['/field-visits'], { state: { fieldId: this.field.id } });
  }
  ngOnInit() {
    this.userService.getFarmersofDivision(this.user.division).subscribe(data => {
      this.farmerCount = data.length;

    })
    this.counts = [];

    let fieldvisits: FieldVisit[];
    let i = 0;
    let countsTemp:{ [key: string]: number } = {
      pending: 0,
      confirmed: 0,
      declined: 0,
      processing: 0,
      completed: 0,
    }
    this.fieldService.getFieldsOfDivision(this.user.division).subscribe(data => {
      this.fieldCount = data.length;
      data.forEach(a => {
        this.fieldVisitService.getFieldVisitRequests(a.payload.doc.id).subscribe(data => {
          fieldvisits = data.map(a => {
            return {
              ...a as FieldVisit
            }
          })
          fieldvisits.forEach(visit => {
            countsTemp[visit.status]++;
            this.fieldVisitCount++;
          })
          i++;
          if (i == this.fieldCount)
            Object.keys(countsTemp).forEach(key => {

              if (countsTemp[key] != 0)
                this.counts.push({
                  status: key,
                  count: countsTemp[key]
                })
            });

        });
      })

    })





  }


}

