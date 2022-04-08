import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { UserTemp } from '../../models/user.model';
import { FieldVisitService } from './../../services/field-visit.service';
import { FieldVisitReqTemp } from '../../models/field-visit.model';
import { ComplexOuterSubscriber } from 'rxjs/internal/innerSubscribe';
import { ColdObservable } from 'rxjs/internal/testing/ColdObservable';
import { Color } from 'ng2-charts';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  focus: any;
  focus1: any;
  type: any;
  officers: UserTemp[];
  provinces = new Set();
  districts = new Set();
  divisions = new Set();
  farmersactive: User[];
  farmers: UserTemp[];
  fieldvisits: FieldVisitReqTemp[];
  // fieldVisitMonthYear: { [key: string]: number }
  fieldVisitMonthYear = new Map<string, any>();
  fieldVisitReqMonthYear = new Map<string, any>();
  monthlyRegisteredFarmers = new Map<string, any>();
  show1: any;
  totalActiveCounts: any;
  array: any;
  // green=rgb(60,179,113);
  //   let mp = new Map();
  // mp.set('1','Annad');

  constructor(private router: Router, private userService: UserService, private fieldVisitService: FieldVisitService) { }

  public fieldVisitChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  fieldVisitChartLabels;
  fieldVisitChartType = 'line';
  fieldVisitChartLegend = true;
  fieldVisitChartData;
  fieldVisitReqChartLabels;
  fieldVisitReqChartType = 'line';
  fieldVisitReqChartLegend = true;
  fieldVisitReqChartData;
  farmerChartLabels;
  farmerChartType = 'line';
  farmerChartLegend = true;
  farmerChartData;
  isLoaded = false;
  isLoaded2 = false;


  ngOnInit() {
    this.getCounts();
    this.getFarmerChartData();
    this.getFieldVisitChartData();
  }

  getFarmerChartData() {
    this.userService.getActiveUsers('farmer').subscribe(data => {
      this.farmersactive = data.map(e => {
        return {
          ...e.payload.doc.data() as {},
        } as User;
      })

      this.farmersactive.forEach(v => {
        let month = new Date(v.createdDate).getMonth() + 1;
        let dm = new Date(v.createdDate).getFullYear() + "/" + month;
        this.monthlyRegisteredFarmers.set(dm, 0);
      })

      this.farmersactive.forEach(v => {
        let month = new Date(v.createdDate).getMonth() + 1;
        let dm = new Date(v.createdDate).getFullYear() + "/" + month;
        let val = this.monthlyRegisteredFarmers.get(dm);
        this.monthlyRegisteredFarmers.set(dm, ++val);
      })
      var keys=Array.from(this.monthlyRegisteredFarmers.keys()).sort();
      var values=[];
      keys.forEach(a=>{
        values.push(this.monthlyRegisteredFarmers.get(a));
      })


      // this.array = Array.from(this.monthlyRegisteredFarmers.values());
      let i = 0;
      for (i = 1; i < values.length; i++) {
        values[i] += values[i - 1];
      }
      this.farmerChartLabels = keys;
      this.farmerChartData = [
        { data: values, label: 'Farmers', backgroundColor: "#3CB371", borderColor: "#008000" },
      ];
      this.isLoaded2 = true;
    })
  }

  getFieldVisitChartData() {
    var val1;
    var val2;
    this.fieldVisitService.getAllFieldVisitRequests().subscribe(data => {
      this.fieldvisits = data.map(a => {
        return {
          ...a as FieldVisitReqTemp
        }
      })
      this.fieldvisits.forEach(v => {
        if ((v.status == 'processing' || v.status == 'completed') && v.visitDate != undefined) {

          let month = new Date(v.visitDate).getMonth() + 1;
          let dm = new Date(v.visitDate).getFullYear() + "/" + month;
          this.fieldVisitMonthYear.set(dm, 0);
        }
  
        let month = new Date(v.createdDate).getMonth() + 1;
        let dm = new Date(v.createdDate).getFullYear() + "/" + month;
        this.fieldVisitReqMonthYear.set(dm, 0);

      })
      val1=Array.from(this.fieldVisitMonthYear.keys()).sort();
      val2=Array.from(this.fieldVisitReqMonthYear.keys()).sort();

      this.fieldvisits.forEach(v => {
        if ((v.status == 'processing' || v.status == 'completed') && v.visitDate != undefined) {

          let month = new Date(v.visitDate).getMonth() + 1;
          let dm = new Date(v.visitDate).getFullYear() + "/" + month;

          let val = this.fieldVisitMonthYear.get(dm);
          this.fieldVisitMonthYear.set(dm, ++val);
        }
        let month2 = new Date(v.createdDate).getMonth() + 1;
        let dm2 = new Date(v.createdDate).getFullYear() + "/" + month2;
        let val2 = this.fieldVisitReqMonthYear.get(dm2);
        this.fieldVisitReqMonthYear.set(dm2, ++val2);
      })
      var val3=[];
      var val4=[];
      val1.forEach(v=>{
        val3.push(this.fieldVisitMonthYear.get(v));
      })
      val2.forEach(v=>{
        val4.push(this.fieldVisitReqMonthYear.get(v));
      })

      console.log(this.fieldVisitMonthYear)
      this.fieldVisitChartLabels = val1;
      // let val = Array.from(this.fieldVisitMonthYear.values());
      this.fieldVisitChartData = [
        { data: val3, label: 'Field Visits', backgroundColor: "#3CB371", borderColor: "#008000" },
      ];
      this.fieldVisitReqChartLabels = val2;
      // let valReq = Array.from(this.fieldVisitReqMonthYear.values());
      this.fieldVisitReqChartData = [
        { data: val4, label: 'Field Visit Requests', backgroundColor: "#3CB371", borderColor: "#008000" },
      ];
      this.isLoaded = true;

    });
  }

  getCounts() {
    this.userService.getUsers('officer', 'active_count').subscribe(data => {
      this.officers = data.map(e => {
        return {
          ...e.payload.doc.data() as {},
          id: e.payload.doc.id,
        } as UserTemp;
      })

      this.officers.forEach(officer => {
        this.provinces.add(officer.province);
        this.districts.add(officer.district);
        this.divisions.add(officer.division);
      })

    });
    this.userService.getUsers('farmer', 'active_count').subscribe(data => {
      this.farmers = data.map(e => {
        return {
          ...e.payload.doc.data() as {},
          id: e.payload.doc.id,
        } as UserTemp;
      })

    });
  }
  viewFields() {
    this.router.navigate(['/fields']);
  }
  viewReports() {
    this.type = 'reports';
  }
  viewNav() {
    this.type = '';
  }
  viewUsers() {
    this.router.navigate(['/farmers'], { state: { role: 'farmer' } });
  }
  viewRequests() {
    this.router.navigate(['/requests'], { state: { role: 'farmer', type: 'request' } });
  }
  viewOfficerRequests() {
    this.router.navigate(['/officer-requests'], { state: { role: 'officer', type: 'request' } });
  }
  viewOfficers() {
    this.router.navigate(['/admin-officers'], { state: { role: 'officer' } });
  }
  viewDivisions() {
    this.router.navigate(['/divisions'], { state: { role: 'officer', type: '' } });
  }

  viewFieldVisits() {
    this.router.navigate(['/field-visits'], { state: { fieldId: 'all', type: 'visit' } });
  }
  viewFieldVisitRequests() {
    this.router.navigate(['/field-visit-requests'], { state: { fieldId: 'all', type: 'request' } });
  }

  viewProfile() {
    this.router.navigate(['/admin-profile'], { state: { type: 'admin' } });
  }
  divisionReports() {
    this.router.navigate(['/select-report'], { state: { role: 'officer', type: 'division' } });
  }
  officerReports() {
    this.router.navigate(['/admin-officer-reports'], { state: { role: 'agricultural officer' } });
    // this.router.navigate(['/select-report'], { state: { role: 'officer', type: 'officer' } });
  }
  farmerReports() {
    // this.router.navigate(['/select-report'], { state: { role: 'officer', type: 'farmer' } });
    this.router.navigate(['/admin-farmer-reports'], { state: { role: 'farmer' } });
  }
  fieldReports() {
    this.router.navigate(['/admin-field-reports'], { state: { role: 'field' } });
  }
  requestReports() {
    this.router.navigate(['/select-report'], { state: { role: 'officer', type: 'request' } });
  }
  visitReports() {
    this.router.navigate(['/select-report'], { state: { role: 'officer', type: 'field' } });
  }
}

