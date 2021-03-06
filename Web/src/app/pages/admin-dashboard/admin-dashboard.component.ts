import { FieldData } from 'app/models/field-data.model';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { FieldDataService } from '../../services/field-data.service';
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
  officersactive: User[];
  fieldData: FieldData[];
  farmers: UserTemp[];
  fieldvisits: FieldVisitReqTemp[];
  nLevelCounts: [];
  // fieldVisitMonthYear: { [key: string]: number }
  fieldVisitMonthYear = new Map<string, any>();
  fieldVisitReqMonthYear = new Map<string, any>();
  monthlyRegisteredFarmers = new Map<string, any>();
  monthlyRegisteredofficers = new Map<string, any>();
  nLevelCountsMap = new Map<number, any>();
  nLevelCountsMap2 = new Map<string, any>();
  nLevelCountsMap3 = new Map<string, any>();
  nLevelCountsMap4 = new Map<string, any>();
  nLevelCountsMap5 = new Map<string, any>();
  temp2 = new Map<string, any>();
  temp3 = new Map<string, any>();
  temp4 = new Map<string, any>();
  temp5 = new Map<string, any>();
  allDates = new Map<string, any>();


  show1: any;
  totalActiveCounts: any;
  array: any;
  // green=rgb(60,179,113);
  //   let mp = new Map();
  // mp.set('1','Annad');

  constructor(private router: Router,private userService: UserService, private fieldDataService: FieldDataService, private fieldVisitService: FieldVisitService) {
    // if (this.router.getCurrentNavigation().extras.state != undefined)
    //   this.type = this.router.getCurrentNavigation().extras.state.type;
    var currentUrl = window.location.href;
    if (currentUrl.includes('reports')) {
      this.type = 'reports'
    }

  }

  public options = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  fieldVisitChartLabels;
  lineChart = 'line';
  fieldVisitChartData;
  fieldVisitReqChartLabels;
  fieldVisitReqChartData;
  farmerChartLabels;
  farmerChartData;
  officerChartLabels;
  officerChartData;
  reqChartLabels;
  doughnut = 'doughnut';
  reqChartData;
  nChartLabels;
  nChartData;
  nChartLabels2;
  nChartData2;
  isLoaded = false;
  isLoaded2 = false;
  isLoaded3 = false;
  loadCharts = false;
  isLoaded4 = false;
  isLoaded5 = false;


  ngOnInit() {
    this.getCounts();
    this.getFarmerChartData();
    this.getFieldVisitChartData();
    this.getNLevelData();
    this.getNLevelChangingData();
    this.getofficerChartData();
  }



  getNLevelChangingData() {
    this.fieldDataService.getAllFieldData().subscribe(data => {

      this.fieldData = data.map(e => {
        return {
          ...e.payload.doc.data() as {},
        } as FieldData;
      })
      this.fieldData.forEach(f => {
        var mnt = new Date(f.timestamp).getMonth().toString();
        var yr = new Date(f.timestamp).getFullYear().toString();
        var key = yr + "/" + mnt;

        this.temp2.set(key, 0);
        this.temp3.set(key, 0);
        this.temp4.set(key, 0);
        this.temp5.set(key, 0);
      })

      Array.from(this.temp2.keys()).sort().forEach(q => {
        this.nLevelCountsMap2.set(q, 0);
      })
      Array.from(this.temp3.keys()).sort().forEach(q => {
        this.nLevelCountsMap3.set(q, 0);
      })
      Array.from(this.temp4.keys()).sort().forEach(q => {
        this.nLevelCountsMap4.set(q, 0);
      })
      Array.from(this.temp5.keys()).sort().forEach(q => {
        this.nLevelCountsMap5.set(q, 0);
      })

      this.fieldData.forEach(f => {
        var mnt = new Date(f.timestamp).getMonth().toString();
        var yr = new Date(f.timestamp).getFullYear().toString();
        var key = yr + "/" + mnt;
        var o = 0;
        var val = 0;
        if (f.level == 2) {
          val = this.nLevelCountsMap2.get(key);
          this.nLevelCountsMap2.set(key, val + 1);
          this.temp2.set(key, val + 1);

        }
        else if (f.level == 3) {
          val = this.nLevelCountsMap3.get(key);
          this.nLevelCountsMap3.set(key, val + 1);
          this.temp3.set(key, val + 1);

        }
        else if (f.level == 4) {
          val = this.nLevelCountsMap4.get(key);
          this.nLevelCountsMap4.set(key, val + 1);
          this.temp4.set(key, val + 1);

        }
        else if (f.level == 5) {
          val = this.nLevelCountsMap5.get(key);
          this.nLevelCountsMap5.set(key, val + 1);
          this.temp5.set(key, val + 1);

        }
        console.log(o)
      })
      var map2 =


        this.nChartLabels2 = Array.from(this.nLevelCountsMap5.keys()).sort();
      this.nChartLabels2.forEach(element => {
        this.nLevelCountsMap2.set(element, Math.round(this.temp2.get(element) / (this.temp2.get(element) + this.temp3.get(element) + this.temp4.get(element) + this.temp5.get(element)) * 100))
        this.nLevelCountsMap3.set(element, Math.round(this.temp3.get(element) / (this.temp2.get(element) + this.temp3.get(element) + this.temp4.get(element) + this.temp5.get(element)) * 100))
        this.nLevelCountsMap4.set(element, Math.round(this.temp4.get(element) / (this.temp2.get(element) + this.temp3.get(element) + this.temp4.get(element) + this.temp5.get(element)) * 100))
        this.nLevelCountsMap5.set(element, Math.round(this.temp5.get(element) / (this.temp2.get(element) + this.temp3.get(element) + this.temp4.get(element) + this.temp5.get(element)) * 100))
      });
      this.nChartData2 = [
        { data: Array.from(this.nLevelCountsMap2.values()), label: 'Level 2', backgroundColor: 'rgba(247,181,181,0.2)' },
        { data: Array.from(this.nLevelCountsMap3.values()), label: 'Level 3' },
        { data: Array.from(this.nLevelCountsMap4.values()), label: 'Level 4' },
        { data: Array.from(this.nLevelCountsMap5.values()), label: 'Level 5' },
      ];
      this.isLoaded4 = true;

    })
  }
  getNLevelData() {
    this.fieldDataService.getAllFieldData().subscribe(data => {

      this.fieldData = data.map(e => {
        return {
          ...e.payload.doc.data() as {},
        } as FieldData;
      })
      this.fieldData.forEach(f => {

      })
      // console.log(this.fieldData)

      let i = 2;
      for (i = 2; i < 6; i++) {
        this.nLevelCountsMap.set(i, 0);
      }

      this.fieldData.forEach(v => {
        var c = this.nLevelCountsMap.get(v.level);
        console.log(v.level + '' + c + "/")
        console.log(c++)
        this.nLevelCountsMap.set(v.level, c++);
      })
      var keys = [];
      for (i = 2; i < 6; i++) {
        keys.push("Level " + i.toString())
      }
      var values = [];
      Array.from(this.nLevelCountsMap.values()).forEach(val => {
        values.push(Math.round(val * 100 / this.fieldData.length))
      })

      this.nChartLabels = keys;
      this.nChartData = [
        { data: values, label: 'N Levels' },
      ];
      this.isLoaded3 = true;

    })
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
      var keys = Array.from(this.monthlyRegisteredFarmers.keys()).sort();
      var values = [];
      keys.forEach(a => {
        values.push(this.monthlyRegisteredFarmers.get(a));
      })


      // this.array = Array.from(this.monthlyRegisteredFarmers.values());
      let i = 0;
      for (i = 1; i < values.length; i++) {
        values[i] += values[i - 1];
      }
      this.farmerChartLabels = keys;
      this.farmerChartData = [
        { data: values, label: 'Farmers' },
      ];
      this.isLoaded2 = true;

    })
  }
  getofficerChartData() {
    this.userService.getActiveUsers('agricultural officer').subscribe(data => {
      this.officersactive = data.map(e => {
        return {
          ...e.payload.doc.data() as {},
        } as User;
      })

      this.officersactive.forEach(v => {
        let month = new Date(v.createdDate).getMonth() + 1;
        let dm = new Date(v.createdDate).getFullYear() + "/" + month;
        this.monthlyRegisteredofficers.set(dm, 0);
      })
      console.log(this.monthlyRegisteredofficers)
      this.officersactive.forEach(v => {
        let month = new Date(v.createdDate).getMonth() + 1;
        let dm = new Date(v.createdDate).getFullYear() + "/" + month;
        let val = this.monthlyRegisteredofficers.get(dm);
        this.monthlyRegisteredofficers.set(dm, ++val);
      })
      var keys = Array.from(this.monthlyRegisteredofficers.keys()).sort();
      var values = [];
      keys.forEach(a => {
        values.push(this.monthlyRegisteredofficers.get(a));
      })
      console.log(this.monthlyRegisteredofficers.values())


      // this.array = Array.from(this.monthlyRegisteredFarmers.values());
      let i = 0;
      for (i = 1; i < values.length; i++) {
        values[i] += values[i - 1];
      }
      this.officerChartLabels = keys;
      this.officerChartData = [
        { data: values, label: 'Officers' },
      ];
      this.isLoaded5 = true;

    })
  }

  getFieldVisitChartData() {
    var val1;
    var val2;
    var countsForbarChart = [0, 0, 0, 0];
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
          this.fieldVisitReqMonthYear.set(dm, 0);
          this.allDates.set(dm, 0);
        }

        let month = new Date(v.createdDate).getMonth() + 1;
        let dm = new Date(v.createdDate).getFullYear() + "/" + month;
        this.fieldVisitReqMonthYear.set(dm, 0);
        this.fieldVisitMonthYear.set(dm, 0);
        this.allDates.set(dm, 0);

        //for Bar chart
        if (v.status == 'processing' || v.status == 'confirmed') {
          countsForbarChart[1]++;
        } else if (v.status == 'pending') {
          countsForbarChart[0]++;
        } else if (v.status == 'declined') {
          countsForbarChart[3]++;
        } else if (v.status == 'completed') {
          countsForbarChart[2]++;
        }

      })

      val1 = Array.from(this.fieldVisitMonthYear.keys()).sort();
      val2 = Array.from(this.fieldVisitReqMonthYear.keys()).sort();

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
      var val3 = [];
      var val4 = [];
      val1.forEach(v => {
        val3.push(this.fieldVisitMonthYear.get(v));
      })
      val2.forEach(v => {
        val4.push(this.fieldVisitReqMonthYear.get(v));
      })

      console.log(this.fieldVisitMonthYear)
      this.fieldVisitChartLabels = val1;
      // let val = Array.from(this.fieldVisitMonthYear.values());
      this.fieldVisitChartData = [
        { data: val3, label: 'Field Visits', backgroundColor: "#3CB371", borderColor: "#008000" },
      ];
      this.fieldVisitReqChartLabels = Array.from(this.allDates.keys()).sort();
      // let valReq = Array.from(this.fieldVisitReqMonthYear.values());
      this.fieldVisitReqChartData = [
        { data: val4, label: 'Field Visit Requests', backgroundColor: 'rgba(247,181,181,0.2)' },
        { data: val3, label: 'Field Visits' },

      ];

      //// Set bar chart 
      this.reqChartLabels = ['Pending', 'In Progress', 'Completed', 'Declined'];
      this.reqChartData = [
        { data: countsForbarChart, label: 'Field Visits' },
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
    this.router.navigate(['/admin-n-level-reports'], { state: { role: 'field visit req' } });
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
    // this.router.navigate(['/select-report'], { state: { role: 'officer', type: 'request' } });
    this.router.navigate(['/admin-field-visit-req-reports'], { state: { role: 'field visit req' } });
  }
  visitReports() {
    this.router.navigate(['/admin-field-visit-reports'], { state: { role: 'field visit' } });
  }
}

