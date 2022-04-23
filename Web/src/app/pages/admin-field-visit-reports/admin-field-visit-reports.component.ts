import { FieldTemp } from '../../models/field.model';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CountsVisit } from 'app/models/user.model';
import { User, UserCredential, UserTemp } from 'app/models/user.model';
import { LCCMainDetails, LCCWeekDetails } from 'app/models/lcc.model';
import { LccService } from 'app/services/lcc.service';
import { DialogService } from 'app/services/dialog.service';
import { DatePipe } from '@angular/common';
import { UserFarmersService } from 'app/services/user-farmers.service';
import { Field } from 'app/models/field.model';
import { FieldService } from 'app/services/field.service';
import { FieldVisitService } from 'app/services/field-visit.service';
import { UserService } from '../../services/user.service';
import divisionalDataFile from '../../../assets/jsonfiles/divisions.json';
import { Router } from '@angular/router';
import { FieldVisitReqTemp } from '../../models/field-visit.model';

@Component({
  selector: 'app-admin-field-visit-reports',
  templateUrl: './admin-field-visit-reports.component.html',
  styleUrls: ['./admin-field-visit-reports.component.css']
})
export class AdminFieldVisitReportsComponent implements OnInit {
  // displayedColumns: string[];
  documentName = "Sample Name";
  date: string;
  province = "Sample Province";
  district = "Sample District";
  division = "Sample Division";
  role; type;
  users: UserTemp[];
  usersForActive: UserTemp[];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSource: MatTableDataSource<CountsVisit>;

  farmerCount;
  processingCount;
  completedCount;
  provinceCount;
  districtCount;
  divisionCount;
  tempCounts = [0, 0, 0, 0];
  reportType = "Farmers Report";
  changedWeekDetails: LCCWeekDetails[];
  lccMainDetails: LCCMainDetails;
  havePreviousRecords: boolean = false;
  divisionalData = divisionalDataFile;
  list;
  periods;
  period;
  userField: Field[];
  approved = 0;
  declined = 0;
  pending = 0;
  all = 0;
  fields: Field[];
  fieldvisitReqs: FieldVisitReqTemp[];
  fieldvisitReqsInitial: FieldVisitReqTemp[];
  passedUser: User;
  length = false;
  totalFarmers;
  provinces: Map<string, number[]> = new Map<string, number[]>();
  districts: Map<string, number[]> = new Map<string, number[]>();
  divisions: Map<string, number[]> = new Map<string, number[]>();
  provincesInitial: Map<string, number[]> = new Map<string, number[]>();
  districtsInitial: Map<string, number[]> = new Map<string, number[]>();
  divisionsInitial: Map<string, number[]> = new Map<string, number[]>();
  provincesActive: Map<string, number> = new Map<string, number>();
  districtsActive: Map<string, number> = new Map<string, number>();
  divisionsActive: Map<string, number> = new Map<string, number>();
  values: CountsVisit[] = [];
  none;
  focus1;
  optionSelected;
  proviceSelected;
  displayedColumns;
  timeSelected;
  name;
  selections = ['Provinces', 'Districts', 'Divisions', 'Province', 'District'];
  timeSelections = ['All', 'Year', 'Month'];
  years = new Set();
  months = new Set();
  column;
  // dataSource: MatTableDataSource<User>;

  constructor(private router: Router, private userService: UserService, private datepipe: DatePipe, private userFarmersService: UserFarmersService, private fieldService: FieldService, private fieldVisitService: FieldVisitService) {
    this.date = this.datepipe.transform((new Date), 'MMM d, y').toString();
    this.optionSelected = 'Provinces'
    this.timeSelected = 'All';
    this.displayedColumns = ['key', 'processing', 'completed', 'total'];
    this.role = this.router.getCurrentNavigation().extras.state.role;
    if (this.role == 'field visit req') {
      this.documentName = "Field Visit Request Report";
      this.name = "Requests";

    } else if (this.role == 'field visit') {
      this.documentName = "Field Visit Report";
      this.name = "Field Visits";

    }

  }
  clearTable() {
    this.values = [];
    this.dataSource = new MatTableDataSource(this.values);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  onTimeOptionSelected(value: any) {
    console.log('Time Option selected')
    this.values = [];
    this.dataSource = new MatTableDataSource(this.values);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    var province = value.toString();
    if (this.timeSelected == 'Month') {
      this.periods = this.months;
      this.period = "Select";
    } else if (this.timeSelected == 'Year') {
      this.periods = this.years;
      this.period = "Select";
    } else if (this.timeSelected == "All") {
      this.fieldvisitReqs = [];  //NS
      this.fieldvisitReqsInitial = [];
      this.districts.clear();
      this.provinces.clear();
      this.divisions.clear();
      this.ngOnInit();
      this.onOptionSelected(this.optionSelected)
    }
  }

  onOptionSelected(value: any) {
    this.values = [];
    // this.timeSelected = "All";
    //get Active div,pro,dis
    this.userService.getActiveUsers('agricultural officer').subscribe(data => {
      this.usersForActive = data.map(e => {
        return {
          ...e.payload.doc.data() as {},
          id: e.payload.doc.id,
        } as UserTemp;
      })

      this.usersForActive.forEach(e => {
        this.provincesActive.set(e.province, this.provincesActive.get(e.province) == null ? 1 : this.provincesActive.get(e.province) + 1);
        this.districtsActive.set(e.district, this.districtsActive.get(e.district) == null ? 1 : this.districtsActive.get(e.district) + 1);
        this.divisionsActive.set(e.division, this.divisionsActive.get(e.division) == null ? 1 : this.divisionsActive.get(e.division) + 1);
      })
    });
    // other 

    if (this.optionSelected == 'Provinces') {
      this.provinces.forEach((value: number[], key: string) => {
        this.values.push({
          key: key,
          processing: value[0],
          completed: value[1],
          total: value[2],
        });
      });

      this.dataSource = new MatTableDataSource(this.values);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.farmerCount = this.tempCounts[0];
      this.provinceCount = this.tempCounts[1];
      this.districtCount = this.tempCounts[2];
      this.divisionCount = this.tempCounts[3];
      this.processingCount = this.tempCounts[4];
      this.completedCount = this.tempCounts[5];
      this.column = "Province";

    } else if (this.optionSelected == 'Districts') {
      this.districts.forEach((value: number[], key: string) => {
        this.values.push({
          key: key,
          processing: value[0],
          completed: value[1],
          total: value[2],
        });
      });

      this.dataSource = new MatTableDataSource(this.values);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.farmerCount = this.tempCounts[0];
      this.provinceCount = this.tempCounts[1];
      this.districtCount = this.tempCounts[2];
      this.divisionCount = this.tempCounts[3];
      this.processingCount = this.tempCounts[4];
      this.completedCount = this.tempCounts[5];
      this.column = "District";

    }
    else if (this.optionSelected == 'Province') {
      this.clearTable();
      this.list = Array.from(this.provincesActive.keys()).sort();;
      this.farmerCount = 0;
      this.provinceCount = 0;
      this.districtCount = 0;
      this.divisionCount = 0;
      this.processingCount = 0;
      this.completedCount = 0;

    }
    else if (this.optionSelected == 'District') {
      this.clearTable();
      this.farmerCount = 0;
      this.provinceCount = 0;
      this.districtCount = 0;
      this.divisionCount = 0;
      this.processingCount = 0;
      this.completedCount = 0;
      // this.list = this.divisionalData.provinces;
      // let val, i;
      // let allDistricts = [];
      // this.divisionalData.provinces.forEach(pro => {
      //   val = this.divisionalData["" + pro + ""];
      //   for (i = 0; i < val.length; i++) {
      //     allDistricts.push(val[i]);
      //   }
      // })
      this.list = Array.from(this.districtsActive.keys()).sort();;

    } else if (this.optionSelected == 'Division') {
      this.clearTable();
      this.farmerCount = 0;
      this.provinceCount = 0;
      this.districtCount = 0;
      this.divisionCount = 0;
      this.processingCount = 0;
      this.completedCount = 0;
      // this.list = this.divisionalData.provinces;
      // let val, i;
      // let allDistricts = [];
      // this.divisionalData.provinces.forEach(pro => {
      //   val = this.divisionalData["" + pro + ""];
      //   for (i = 0; i < val.length; i++) {
      //     allDistricts.push(val[i]);
      //   }
      // })
      this.list = Array.from(this.divisionsActive.keys()).sort();;

    }
    else if (this.optionSelected == 'Divisions') { // has to implement
      this.clearTable();
      let allDistricts = [];
      let allDivisions = [];
      let val, i;
      this.divisionalData.provinces.forEach(pro => {
        val = this.divisionalData["" + pro + ""];
        for (i = 0; i < val.length; i++) {
          allDistricts.push(val[i]);
        }
      });
      allDistricts.forEach(dis => {
        // if (dis != "District") {
        val = this.divisionalData["" + dis + ""];
        for (i = 0; i < val.length; i++) {
          allDivisions.push(val[i]);
        }
        // }
      })
      this.list = allDivisions.sort; // add divisions to dropdown

      this.divisions.forEach((value: number[], key: string) => {
        this.values.push({
          key: key,
          processing: value[0],
          completed: value[1],
          total: value[2],
        });
      });

      this.farmerCount = this.tempCounts[0];
      this.provinceCount = this.tempCounts[1];
      this.districtCount = this.tempCounts[2];
      this.divisionCount = this.tempCounts[3];
      this.processingCount = this.tempCounts[4];
      this.completedCount = this.tempCounts[5];
      this.dataSource = new MatTableDataSource(this.values);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.column = "Division";

    }

  }
  onMonthorYearSelected(value: any) {
    var select = value.toString();

    //should filter dates from the month and year seperatly
    this.fieldvisitReqs = [];
    this.processingCount = 0;
    this.completedCount = 0;
    this.provinces.clear();
    this.districts.clear();
    this.divisions.clear();
    this.fieldvisitReqsInitial.forEach(req => {
      var date = new Date(req.createdDate);
      var year = date.getFullYear().toString();
      var monthYr = (date.getMonth() + 1).toString() + " / " + date.getFullYear().toString();
      if (this.timeSelected == "Month" && monthYr == select) {
        this.fieldvisitReqs.push(req)
        if (this.provinces.get(req.province) == null) this.provinces.set(req.province, [0, 0, 0]);
        if (this.districts.get(req.district) == null) this.districts.set(req.district, [0, 0, 0]);
        if (this.divisions.get(req.division) == null) this.divisions.set(req.division, [0, 0, 0]);

        //add counts
        if (req.status == "processing") this.processingCount++;
        if (req.status == "completed") this.completedCount++;
        this.provinces.set(req.province, [req.status == "processing" ? this.provinces.get(req.province)[0] + 1 : this.provinces.get(req.province)[0], req.status == 'completed' ? this.provinces.get(req.province)[1] + 1 : this.provinces.get(req.province)[1], this.provinces.get(req.province)[2] + 1]);
        this.districts.set(req.district, [req.status == "processing" ? this.districts.get(req.district)[0] + 1 : this.districts.get(req.district)[0], req.status == 'completed' ? this.districts.get(req.district)[1] + 1 : this.districts.get(req.district)[1], this.districts.get(req.district)[2] + 1]);
        this.divisions.set(req.division, [req.status == "processing" ? this.divisions.get(req.division)[0] + 1 : this.divisions.get(req.division)[0], req.status == 'completed' ? this.divisions.get(req.division)[1] + 1 : this.divisions.get(req.division)[1], this.divisions.get(req.division)[2] + 1]);

      } else if (this.timeSelected == "Year" && year == select) {
        this.fieldvisitReqs.push(req)
        if (this.provinces.get(req.province) == null) this.provinces.set(req.province, [0, 0, 0]);
        if (this.districts.get(req.district) == null) this.districts.set(req.district, [0, 0, 0]);
        if (this.divisions.get(req.division) == null) this.divisions.set(req.division, [0, 0, 0]);

        //add counts
        if (req.status == "processing") this.processingCount++;
        if (req.status == "completed") this.completedCount++;
        this.provinces.set(req.province, [req.status == "processing" ? this.provinces.get(req.province)[0] + 1 : this.provinces.get(req.province)[0], req.status == 'completed' ? this.provinces.get(req.province)[1] + 1 : this.provinces.get(req.province)[1], this.provinces.get(req.province)[2] + 1]);
        this.districts.set(req.district, [req.status == "processing" ? this.districts.get(req.district)[0] + 1 : this.districts.get(req.district)[0], req.status == 'completed' ? this.districts.get(req.district)[1] + 1 : this.districts.get(req.district)[1], this.districts.get(req.district)[2] + 1]);
        this.divisions.set(req.division, [req.status == "processing" ? this.divisions.get(req.division)[0] + 1 : this.divisions.get(req.division)[0], req.status == 'completed' ? this.divisions.get(req.division)[1] + 1 : this.divisions.get(req.division)[1], this.divisions.get(req.division)[2] + 1]);

      }

    })
    this.farmerCount = this.fieldvisitReqs.length;
    this.provinceCount = this.provinces.size;
    this.districtCount = this.districts.size;
    this.divisionCount = this.divisions.size;
    this.onOptionSelected(this.optionSelected)


  }

  onValueSelected(value: any) {
    var select = value.toString();
    this.districts.clear();
    this.divisions.clear(); var p = 0;
    this.processingCount = 0;
    this.completedCount = 0;
    this.fieldvisitReqs.forEach(e => {
      if (e.province == value) {
        if (this.districts.get(e.district) == null) this.districts.set(e.district, [0, 0, 0]);
        if (e.status == "processing") this.processingCount++;
        if (e.status == "completed") this.completedCount++;
        this.districts.set(e.district, [e.status == "processing" ? this.districts.get(e.district)[0] + 1 : this.districts.get(e.district)[0], e.status == 'completed' ? this.districts.get(e.district)[1] + 1 : this.districts.get(e.district)[1], this.districts.get(e.district)[2] + 1]);
      }
      if (e.district == value) {
        if (e.status == "processing") this.processingCount++;
        if (e.status == "completed") this.completedCount++;
        if (this.divisions.get(e.division) == null) this.divisions.set(e.division, [0, 0, 0]);
        this.divisions.set(e.division, [e.status == "processing" ? this.divisions.get(e.division)[0] + 1 : this.divisions.get(e.division)[0], e.status == 'completed' ? this.divisions.get(e.division)[1] + 1 : this.divisions.get(e.division)[1], this.divisions.get(e.division)[2] + 1]);
      }
    })

    if (this.optionSelected == 'Province') {
      this.clearTable();
      var fCount = 0;
      this.districts.forEach((value: number[], key: string) => {
        fCount += value[2]; ////
        //fCount--;
        this.values.push({
          key: key,
          processing: value[0],
          completed: value[1],
          total: value[2],
        });
        if (this.role == 'field visit req' || this.role == 'field visit') {
          
          this.fieldvisitReqs.forEach(e => {

            if (e.district == key) {

              if (e.status == "processing") this.processingCount++;
              if (e.status == "completed") this.completedCount++;
              if (this.divisions.get(e.division) == null) this.divisions.set(e.division, [0, 0, 0]);
              this.divisions.set(e.division, [e.status == "processing" ? this.divisions.get(e.division)[0] + 1 : this.divisions.get(e.division)[0], e.status == 'completed' ? this.divisions.get(e.division)[1] + 1 : this.divisions.get(e.division)[1], this.divisions.get(e.division)[2] + 1]);
            }
          })
        }
      });
      this.provinceCount = 1;
      this.districtCount = this.values.length;
      console.log(this.farmerCount+"heereeeeeeeeeeee")
      this.farmerCount = fCount;
      this.divisionCount = this.divisions.size;
      this.column = "District";
    } else {
      this.clearTable();

      var fCount = 0;
      this.divisions.forEach((value: number[], key: string) => {
        fCount += value[2];
        this.values.push({
          key: key,
          processing: value[0],
          completed: value[1],
          total: value[2],
        });
      });
      this.provinceCount = 1;
      this.districtCount = 1;
      this.divisionCount = this.values.length;
      this.farmerCount = fCount;
      this.column = "Division";
    }

    this.dataSource = new MatTableDataSource(this.values);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  show() {
    if (this.optionSelected == 'Provinces' || this.optionSelected == 'Districts' || this.optionSelected == 'Divisions') {
      return false
    } else {
      return true
    }
  }

  show2() {
    if (this.timeSelected == 'All') {
      return false
    } else {
      return true
    }
  }

  ngOnInit(): void {
    this.tempCounts = [0, 0, 0, 0, 0, 0];
    this.fieldvisitReqs = [];
    this.processingCount = 0;
    this.completedCount = 0;

    if (this.role == 'field visit req') {
      this.fieldvisitReqs = [];
      this.fieldvisitReqsInitial = [];
      this.fieldVisitService.getAllFieldVisitRequests().subscribe(data1 => {
        this.totalFarmers = data1.length;
        data1.forEach(e => {
          var temp = {
            ...e as FieldVisitReqTemp
          }
          this.fieldService.getField(temp.fieldId).subscribe(data => {
            var tfield = data.payload.data() as Field;
            if (tfield.status == "active") {
              temp.division = tfield.division;
              temp.district = tfield.district;
              temp.province = tfield.province;
              this.fieldvisitReqs.push(temp)
              this.fieldvisitReqsInitial.push(temp)

              var date = new Date(temp.createdDate);
              this.years.add(date.getFullYear().toString())
              var monthYr = (date.getMonth() + 1).toString() + " / " + date.getFullYear().toString();
              this.months.add(monthYr)

              if (this.provinces.get(temp.province) == null) this.provinces.set(temp.province, [0, 0, 0]);
              if (this.districts.get(temp.district) == null) this.districts.set(temp.district, [0, 0, 0]);
              if (this.divisions.get(temp.division) == null) this.divisions.set(temp.division, [0, 0, 0]);
              if (this.provincesInitial.get(temp.province) == null) this.provincesInitial.set(temp.province, [0, 0, 0]);
              if (this.districtsInitial.get(temp.district) == null) this.districtsInitial.set(temp.district, [0, 0, 0]);
              if (this.divisionsInitial.get(temp.division) == null) this.divisionsInitial.set(temp.division, [0, 0, 0]);

              //add counts


              this.provinces.set(temp.province, [temp.status == "processing" ? this.provinces.get(temp.province)[0] + 1 : this.provinces.get(temp.province)[0], temp.status == 'completed' ? this.provinces.get(temp.province)[1] + 1 : this.provinces.get(temp.province)[1], this.provinces.get(temp.province)[2] + 1]);
              this.districts.set(temp.district, [temp.status == "processing" ? this.districts.get(temp.district)[0] + 1 : this.districts.get(temp.district)[0], temp.status == 'completed' ? this.districts.get(temp.district)[1] + 1 : this.districts.get(temp.district)[1], this.districts.get(temp.district)[2] + 1]);
              this.divisions.set(temp.division, [temp.status == "processing" ? this.divisions.get(temp.division)[0] + 1 : this.divisions.get(temp.division)[0], temp.status == 'completed' ? this.divisions.get(temp.division)[1] + 1 : this.divisions.get(temp.division)[1], this.divisions.get(temp.division)[2] + 1]);

              this.provincesInitial.set(temp.province, [temp.status == "processing" ? this.provincesInitial.get(temp.province)[0] + 1 : this.provincesInitial.get(temp.province)[0], temp.status == 'completed' ? this.provincesInitial.get(temp.province)[1] + 1 : this.provincesInitial.get(temp.province)[1], this.provincesInitial.get(temp.province)[2] + 1]);
              this.districtsInitial.set(temp.district, [temp.status == "processing" ? this.districtsInitial.get(temp.district)[0] + 1 : this.districtsInitial.get(temp.district)[0], temp.status == 'completed' ? this.districtsInitial.get(temp.district)[1] + 1 : this.districtsInitial.get(temp.district)[1], this.districtsInitial.get(temp.district)[2] + 1]);
              this.divisionsInitial.set(temp.division, [temp.status == "processing" ? this.divisionsInitial.get(temp.division)[0] + 1 : this.divisionsInitial.get(temp.division)[0], temp.status == 'completed' ? this.divisionsInitial.get(temp.division)[1] + 1 : this.divisionsInitial.get(temp.division)[1], this.divisionsInitial.get(temp.division)[2] + 1]);

            }
            this.farmerCount = this.fieldvisitReqs.length;
            this.provinceCount = this.provinces.size;
            this.districtCount = this.districts.size;
            this.divisionCount = this.divisions.size;
            this.tempCounts[0] = this.fieldvisitReqs.length;
            this.tempCounts[1] = this.provinces.size;
            this.tempCounts[2] = this.districts.size;
            this.tempCounts[3] = this.divisions.size;

            this.onOptionSelected('Provinces');
          })
          // return temp;
        })
      });
    } else if (this.role == 'field visit') {
      this.fieldvisitReqs = [];
      this.fieldvisitReqsInitial = [];
      this.fieldVisitService.getAllFieldVisitRequests().subscribe(data1 => {
        this.totalFarmers = data1.length;
        data1.forEach(e => {
          var temp = {
            ...e as FieldVisitReqTemp
          }
          this.fieldService.getField(temp.fieldId).subscribe(data => {
            var tfield = data.payload.data() as Field;
            if (tfield.status == "active" && (temp.status == "processing" || temp.status == "completed")) {
              temp.division = tfield.division;
              temp.district = tfield.district;
              temp.province = tfield.province;
              temp.createdDate = temp.visitDate; //
              this.fieldvisitReqs.push(temp)
              this.fieldvisitReqsInitial.push(temp)
              var date = new Date(temp.visitDate);
              this.years.add(date.getFullYear().toString())
              var monthYr = (date.getMonth() + 1).toString() + " / " + date.getFullYear().toString();
              this.months.add(monthYr)

              //add counts
              if (temp.status == "processing") this.processingCount++;
              if (temp.status == "completed") this.completedCount++;
              if (this.provinces.get(temp.province) == null) this.provinces.set(temp.province, [0, 0, 0]);
              if (this.districts.get(temp.district) == null) this.districts.set(temp.district, [0, 0, 0]);
              if (this.divisions.get(temp.division) == null) this.divisions.set(temp.division, [0, 0, 0]);
              if (this.provincesInitial.get(temp.province) == null) this.provincesInitial.set(temp.province, [0, 0, 0]);
              if (this.districtsInitial.get(temp.district) == null) this.districtsInitial.set(temp.district, [0, 0, 0]);
              if (this.divisionsInitial.get(temp.division) == null) this.divisionsInitial.set(temp.division, [0, 0, 0]);

              this.provinces.set(temp.province, [temp.status == "processing" ? (this.provinces.get(temp.province)[0] + 1) : this.provinces.get(temp.province)[0], temp.status == 'completed' ? this.provinces.get(temp.province)[1] + 1 : this.provinces.get(temp.province)[1], this.provinces.get(temp.province)[2] + 1]);
              this.districts.set(temp.district, [temp.status == "processing" ? this.districts.get(temp.district)[0] + 1 : this.districts.get(temp.district)[0], temp.status == 'completed' ? this.districts.get(temp.district)[1] + 1 : this.districts.get(temp.district)[1], this.districts.get(temp.district)[2] + 1]);
              this.divisions.set(temp.division, [temp.status == "processing" ? this.divisions.get(temp.division)[0] + 1 : this.divisions.get(temp.division)[0], temp.status == 'completed' ? this.divisions.get(temp.division)[1] + 1 : this.divisions.get(temp.division)[1], this.divisions.get(temp.division)[2] + 1]);

              this.provincesInitial.set(temp.province, [temp.status == "processing" ? this.provincesInitial.get(temp.province)[0] + 1 : this.provincesInitial.get(temp.province)[0], temp.status == 'completed' ? this.provincesInitial.get(temp.province)[1] + 1 : this.provincesInitial.get(temp.province)[1], this.provincesInitial.get(temp.province)[2] + 1]);
              this.districtsInitial.set(temp.district, [temp.status == "processing" ? this.districtsInitial.get(temp.district)[0] + 1 : this.districtsInitial.get(temp.district)[0], temp.status == 'completed' ? this.districtsInitial.get(temp.district)[1] + 1 : this.districtsInitial.get(temp.district)[1], this.districtsInitial.get(temp.district)[2] + 1]);
              this.divisionsInitial.set(temp.division, [temp.status == "processing" ? this.divisionsInitial.get(temp.division)[0] + 1 : this.divisionsInitial.get(temp.division)[0], temp.status == 'completed' ? this.divisionsInitial.get(temp.division)[1] + 1 : this.divisionsInitial.get(temp.division)[1], this.divisionsInitial.get(temp.division)[2] + 1]);

            }
            console.log("kkkkkkkkkkkkkkkkkk", this.provinces)

            this.farmerCount = this.fieldvisitReqs.length;
            this.provinceCount = this.provinces.size;
            this.districtCount = this.districts.size;
            this.divisionCount = this.divisions.size;
            this.tempCounts[0] = this.fieldvisitReqs.length;
            this.tempCounts[1] = this.provinces.size;
            this.tempCounts[2] = this.districts.size;
            this.tempCounts[3] = this.divisions.size;
            this.tempCounts[4] = this.processingCount;
            this.tempCounts[5] = this.completedCount;

            this.onOptionSelected('Provinces');
            this.column = "Province";
          })
        })
      });
    }
  }
}

