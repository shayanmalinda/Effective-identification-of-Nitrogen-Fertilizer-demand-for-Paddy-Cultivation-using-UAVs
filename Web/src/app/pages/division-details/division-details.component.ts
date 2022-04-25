import { FieldTemp } from './../../models/field.model';
import { FieldService } from 'app/services/field.service';
import { UserService } from 'app/services/user.service';
import { UserTemp } from './../../models/user.model';
import { FieldVisitService } from '../../services/field-visit.service';
import { FieldVisit } from '../../models/field-visit.model';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../models/user.model';
import { FieldVisitReqTemp } from '../../models/field-visit.model';
import { FieldDataService } from '../../services/field-data.service';
import { FieldData } from 'app/models/field-data.model';

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
  monthlyRegisteredFarmers = new Map<string, any>();
  fieldVisitMonthYear = new Map<string, any>();
  fieldVisitReqMonthYear = new Map<string, any>();
  allDates = new Map<string, any>();
  nLevelCountsMap2 = new Map<string, any>();
  nLevelCountsMap3 = new Map<string, any>();
  nLevelCountsMap4 = new Map<string, any>();
  nLevelCountsMap5 = new Map<string, any>();
  temp2 = new Map<string, any>();
  temp3 = new Map<string, any>();
  temp4 = new Map<string, any>();
  temp5 = new Map<string, any>();
  farmersactive: User[];
  fieldData: FieldData[];
  filteredFieldData: FieldData[];
  farmerChartLabels;
  farmerChartData;
  isLoaded1 = false;
  isLoaded2 = false;
  fieldVisitChartLabels;
  lineChart = 'line';
  fieldVisitChartData;
  fieldVisitReqChartLabels;
  fieldVisitReqChartData;
  reqChartLabels;
  doughnut = 'doughnut';
  reqChartData;
  public options = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  nLevelCounts: [];
  nLevelCountsMap = new Map<number, any>();
  nChartLabels;
  nChartData;
  isLoaded3 = false;
  nChartLabels2;
  nChartData2;
  isLoaded4 = false;


  constructor(private router: Router, private fieldDataService: FieldDataService, private fieldVisitService: FieldVisitService, private fieldService: FieldService, private userService: UserService) {
    this.user = this.router.getCurrentNavigation().extras.state.user;
    console.log(this.user)

  }
  getFarmerChartData() {
    this.userService.getFarmersofDivision(this.user.division).subscribe(data => {
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
      console.log('Im here')
      this.isLoaded1 = true;

    })
  }
  getColor(status) {
    if (status == 'pending') return '[bg-pending]'
  }
  viewFieldVisits() {
    // this.router.navigate(['/field-visits']);
    this.router.navigate(['/field-visits'], { state: { fieldId: this.field.id } });
  }
  getNLevelData() {
    this.fieldDataService.getAllFieldData().subscribe(data => {

      this.fieldData = data.map(e => {
        return {
          ...e.payload.doc.data() as {},
        } as FieldData;
      })
      var i = 0;
      this.filteredFieldData = [];
      this.fieldData.forEach(f => {
        this.userService.getUser(f.officerId).subscribe(data => {
          i++;
          var officer = data.payload.data() as User;
          if (officer.division == this.user.division) {
            this.filteredFieldData.push(f);
          }
          if (i == (this.fieldData.length)) {
            console.log(this.filteredFieldData)

            let i = 2;
            for (i = 2; i < 6; i++) {
              this.nLevelCountsMap.set(i, 0);
            }

            this.filteredFieldData.forEach(v => {
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
              values.push(Math.round(val * 100 / this.filteredFieldData.length))
            })

            this.nChartLabels = keys;
            this.nChartData = [
              { data: values, label: 'N Levels' },
            ];
            this.isLoaded3 = true;
          }
        });
      })


    })
  }
  getNLevelChangingData() {
    this.fieldDataService.getAllFieldData().subscribe(data => {

      this.fieldData = data.map(e => {
        return {
          ...e.payload.doc.data() as {},
        } as FieldData;
      })
      var i = 0;
      this.filteredFieldData = [];
      this.fieldData.forEach(f => {
        this.userService.getUser(f.officerId).subscribe(data => {
          i++;
          var officer = data.payload.data() as User;
          if (officer.division == this.user.division) {
            this.filteredFieldData.push(f);
          }
          if (i == (this.fieldData.length)) {
            console.log(this.filteredFieldData)

            this.filteredFieldData.forEach(f => {
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

            this.filteredFieldData.forEach(f => {
              var mnt = new Date(f.timestamp).getMonth().toString();
              var yr = new Date(f.timestamp).getFullYear().toString();
              var key = yr + "/" + mnt;
              var o = 0;
              if (f.level == 2) {
                var val = this.nLevelCountsMap2.get(key);
                this.nLevelCountsMap2.set(key, val + 1);
                this.temp2.set(key, val + 1);
              }
              else if (f.level == 3) {
                var val = this.nLevelCountsMap3.get(key);
                this.temp3.set(key, val + 1);
              }
              else if (f.level == 4) {
                var val = this.nLevelCountsMap4.get(key);
                this.temp4.set(key, val + 1);
              }
              else if (f.level == 5) {
                var val = this.nLevelCountsMap5.get(key);
                this.temp5.set(key, val + 1);
              }
              console.log(o)
            })
            
            this.nChartLabels2 = Array.from(this.nLevelCountsMap5.keys()).sort();;
            this.nChartLabels2.forEach(element => {
              this.nLevelCountsMap2.set(element,Math.round(this.temp2.get(element)/(this.temp2.get(element)+this.temp3.get(element)+this.temp4.get(element)+this.temp5.get(element))*100))
              this.nLevelCountsMap3.set(element,Math.round(this.temp3.get(element)/(this.temp2.get(element)+this.temp3.get(element)+this.temp4.get(element)+this.temp5.get(element))*100))
              this.nLevelCountsMap4.set(element,Math.round(this.temp4.get(element)/(this.temp2.get(element)+this.temp3.get(element)+this.temp4.get(element)+this.temp5.get(element))*100))
              this.nLevelCountsMap5.set(element,Math.round(this.temp5.get(element)/(this.temp2.get(element)+this.temp3.get(element)+this.temp4.get(element)+this.temp5.get(element))*100))
            });
            this.nChartData2 = [
              { data: Array.from(this.nLevelCountsMap2.values()), label: 'Level 2' },
              { data: Array.from(this.nLevelCountsMap3.values()), label: 'Level 3' },
              { data: Array.from(this.nLevelCountsMap4.values()), label: 'Level 4' },
              { data: Array.from(this.nLevelCountsMap5.values()), label: 'Level 5' },
            ];
            this.isLoaded4 = true;
          }
        });
      })





    })
  }

  getCountsofDivisions() {
    this.counts = [];

    let fieldvisits: FieldVisitReqTemp[];
    let i = 0;
    let countsTemp: { [key: string]: number } = {
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
              ...a as FieldVisitReqTemp
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
          //loadChartData
          this.getFieldVisitChartData(fieldvisits)

        });
      })


    })
  }
  getFieldVisitChartData(fieldvisits: FieldVisitReqTemp[]) {
    var val1;
    var val2;
    var countsForbarChart = [0, 0, 0, 0];
    // this.fieldVisitService.getAllFieldVisitRequests().subscribe(data => {
    //   fieldvisits = data.map(a => {
    //     return {
    //       ...a as FieldVisitReqTemp
    //     }
    //   })
    fieldvisits.forEach(v => {
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

    fieldvisits.forEach(v => {
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
    console.log(this.fieldVisitReqChartLabels + 'new')
    // let valReq = Array.from(this.fieldVisitReqMonthYear.values());
    this.fieldVisitReqChartData = [
      { data: val4, label: 'Field Visit Requests' },
      { data: val3, label: 'Field Visits' },

    ];

    //// Set bar chart 
    this.reqChartLabels = ['Pending', 'In Progress', 'Completed', 'Declined'];
    this.reqChartData = [
      { data: countsForbarChart, label: 'Field Visits' },
    ];

    this.isLoaded2 = true;
    console.log(this.isLoaded2)
  };

  ngOnInit() {
    this.getFarmerChartData();

    this.userService.getFarmersofDivision(this.user.division).subscribe(data => {
      this.farmerCount = data.length;

    })
    this.getCountsofDivisions();
    this.getNLevelData();
    this.getNLevelChangingData();


  }


}

