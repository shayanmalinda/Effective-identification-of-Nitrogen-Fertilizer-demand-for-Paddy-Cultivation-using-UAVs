import { FieldTemp } from '../../models/field.model';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { CountsReq } from 'app/models/user.model';
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
import { FieldDataService } from '../../services/field-data.service';
import { FieldData } from 'app/models/field-data.model';

@Component({
  selector: 'app-admin-n-level-reports',
  templateUrl: './admin-n-level-reports.component.html',
  styleUrls: ['./admin-n-level-reports.component.css']
})
export class AdminNLevelReportsComponent implements OnInit {
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

  dataSource: MatTableDataSource<CountsReq>;

  farmerCount;
  processingCount;
  completedCount;
  pendingCount;
  confirmedCount;
  declinedCount
  provinceCount;
  districtCount;
  divisionCount;
  tempCounts = [0, 0, 0, 0, 0, 0, 0];
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
  NLevelsofAVisit: Map<string, number[]> = new Map<string, number[]>();
  provinces: Map<string, number[]> = new Map<string, number[]>();
  districts: Map<string, number[]> = new Map<string, number[]>();
  divisions: Map<string, number[]> = new Map<string, number[]>();
  provincesInitial: Map<string, number[]> = new Map<string, number[]>();
  districtsInitial: Map<string, number[]> = new Map<string, number[]>();
  divisionsInitial: Map<string, number[]> = new Map<string, number[]>();
  provincesActive: Map<string, number> = new Map<string, number>();
  districtsActive: Map<string, number> = new Map<string, number>();
  divisionsActive: Map<string, number> = new Map<string, number>();
  values: CountsReq[] = [];
  none;
  focus1;
  optionSelected;
  proviceSelected;
  displayedColumns;
  timeSelected;
  name;
  selections = ['Provinces', 'Districts', 'Divisions', 'Province', 'District', 'Division'];
  timeSelections = ['All', 'Year', 'Month'];
  years = new Set();
  months = new Set();
  column;
  fieldData: FieldData[];

  // dataSource: MatTableDataSource<User>;

  constructor(private router: Router, private fieldDataService: FieldDataService, private userService: UserService, private datepipe: DatePipe, private userFarmersService: UserFarmersService, private fieldService: FieldService, private fieldVisitService: FieldVisitService) {
    this.date = this.datepipe.transform((new Date), 'MMM d, y').toString();
    this.optionSelected = 'Provinces'
    this.timeSelected = 'All';
    this.displayedColumns = ['key', 'pending', 'confirmed', 'declined', 'processing'];
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
    console.log("NMNMNMNMNMNMMMMMMMMMMMMMMMMMMM")
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
          pending: value[0],
          confirmed: value[1],
          declined: value[2],
          processing: value[3],
          completed: value[4],
          total: value[5],
        });
      });

      this.dataSource = new MatTableDataSource(this.values);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      // console.log(this.tempCounts)
      this.farmerCount = this.tempCounts[0];
      this.provinceCount = this.tempCounts[1];
      this.districtCount = this.tempCounts[2];
      this.divisionCount = this.tempCounts[3];
      this.pendingCount = this.tempCounts[4];
      this.confirmedCount = this.tempCounts[5];
      this.declinedCount = this.tempCounts[6];
      this.processingCount = this.tempCounts[7];
      this.completedCount = this.tempCounts[8];
      this.column = "Province";

    } else if (this.optionSelected == 'Districts') {
      this.districts.forEach((value: number[], key: string) => {
        this.values.push({
          key: key,
          pending: value[0],
          confirmed: value[1],
          declined: value[2],
          processing: value[3],
          completed: value[4],
          total: value[5],
        });
      });

      this.dataSource = new MatTableDataSource(this.values);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.farmerCount = this.tempCounts[0];
      this.provinceCount = this.tempCounts[1];
      this.districtCount = this.tempCounts[2];
      this.divisionCount = this.tempCounts[3];
      this.pendingCount = this.tempCounts[4];
      this.confirmedCount = this.tempCounts[5];
      this.declinedCount = this.tempCounts[6];
      this.processingCount = this.tempCounts[7];
      this.completedCount = this.tempCounts[8];
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
      this.confirmedCount = 0;
      this.pendingCount = 0;
      this.declinedCount = 0;
      this.completedCount = 0;


    }
    else if (this.optionSelected == 'District') {
      this.clearTable();
      this.farmerCount = 0;
      this.provinceCount = 0;
      this.districtCount = 0;
      this.divisionCount = 0;
      this.processingCount = 0;
      this.confirmedCount = 0;
      this.pendingCount = 0;
      this.declinedCount = 0;
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
      this.confirmedCount = 0;
      this.pendingCount = 0;
      this.declinedCount = 0;
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
          pending: value[0],
          confirmed: value[1],
          declined: value[2],
          processing: value[3],
          completed: value[4],
          total: value[5],
        });
      });

      this.farmerCount = this.tempCounts[0];
      this.provinceCount = this.tempCounts[1];
      this.districtCount = this.tempCounts[2];
      this.divisionCount = this.tempCounts[3];
      this.pendingCount = this.tempCounts[4];
      this.confirmedCount = this.tempCounts[5];
      this.declinedCount = this.tempCounts[6];
      this.processingCount = this.tempCounts[7];
      this.completedCount = this.tempCounts[8];
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
    this.confirmedCount = 0;
    this.declinedCount = 0;
    this.pendingCount = 0;
    this.provinces.clear();
    this.districts.clear();
    this.divisions.clear();
    this.fieldvisitReqsInitial.forEach(req => {
      var date = new Date(req.createdDate);
      var year = date.getFullYear().toString();
      var monthYr = (date.getMonth() + 1).toString() + " / " + date.getFullYear().toString();
      if (this.timeSelected == "Month" && monthYr == select) {
        this.fieldvisitReqs.push(req)
        if (this.provinces.get(req.province) == null) this.provinces.set(req.province, [0, 0, 0, 0, 0, 0]);
        if (this.districts.get(req.district) == null) this.districts.set(req.district, [0, 0, 0, 0, 0, 0]);
        if (this.divisions.get(req.division) == null) this.divisions.set(req.division, [0, 0, 0, 0, 0, 0]);

        //add counts
        // if (req.status == "pending") this.pendingCount++;
        // if (req.status == "declined") this.declinedCount++;
        // if (req.status == "confirmed") this.confirmedCount++;
        // if (req.status == "processing") this.processingCount++;
        // if (req.status == "completed") this.completedCount++;
        if (this.optionSelected == "Provinces") {
          this.pendingCount = this.provinces.get(req.province)[0];
          this.declinedCount = this.provinces.get(req.province)[1];
          this.confirmedCount = this.provinces.get(req.province)[2];
          this.processingCount = this.provinces.get(req.province)[3];
        } else if (this.optionSelected == "Districts" || this.optionSelected == "Province") {
          this.pendingCount = this.districts.get(req.district)[0];
          this.declinedCount = this.districts.get(req.district)[1];
          this.confirmedCount = this.districts.get(req.district)[2];
          this.processingCount = this.districts.get(req.district)[3];
        } else if (this.optionSelected == "Divisions" || this.optionSelected == "District" || this.optionSelected == "Division") {
          this.pendingCount = this.divisions.get(req.division)[0];
          this.declinedCount = this.divisions.get(req.division)[1];
          this.confirmedCount = this.divisions.get(req.division)[2];
          this.processingCount = this.divisions.get(req.division)[3];
        }

        this.provinces.set(req.province, [this.provinces.get(req.province)[0] + this.NLevelsofAVisit.get(req.id)[0], this.provinces.get(req.province)[1] + this.NLevelsofAVisit.get(req.id)[1], this.provinces.get(req.province)[2] + this.NLevelsofAVisit.get(req.id)[2], this.provinces.get(req.province)[3] + this.NLevelsofAVisit.get(req.id)[3]])
        this.districts.set(req.district, [this.districts.get(req.district)[0] + this.NLevelsofAVisit.get(req.id)[0], this.districts.get(req.district)[1] + this.NLevelsofAVisit.get(req.id)[1], this.districts.get(req.district)[2] + this.NLevelsofAVisit.get(req.id)[2], this.districts.get(req.district)[3] + this.NLevelsofAVisit.get(req.id)[3]])
        this.divisions.set(req.division, [this.divisions.get(req.division)[0] + this.NLevelsofAVisit.get(req.id)[0], this.divisions.get(req.division)[1] + this.NLevelsofAVisit.get(req.id)[1], this.divisions.get(req.division)[2] + this.NLevelsofAVisit.get(req.id)[2], this.divisions.get(req.division)[3] + this.NLevelsofAVisit.get(req.id)[3]])

      } else if (this.timeSelected == "Year" && year == select) {
        this.fieldvisitReqs.push(req)
        if (this.provinces.get(req.province) == null) this.provinces.set(req.province, [0, 0, 0, 0, 0, 0]);
        if (this.districts.get(req.district) == null) this.districts.set(req.district, [0, 0, 0, 0, 0, 0]);
        if (this.divisions.get(req.division) == null) this.divisions.set(req.division, [0, 0, 0, 0, 0, 0]);

        //add counts
        if (this.optionSelected == "Provinces") {
          this.pendingCount = this.provinces.get(req.province)[0];
          this.declinedCount = this.provinces.get(req.province)[1];
          this.confirmedCount = this.provinces.get(req.province)[2];
          this.processingCount = this.provinces.get(req.province)[3];
        } else if (this.optionSelected == "Districts" || this.optionSelected == "Province") {
          this.pendingCount = this.districts.get(req.district)[0];
          this.declinedCount = this.districts.get(req.district)[1];
          this.confirmedCount = this.districts.get(req.district)[2];
          this.processingCount = this.districts.get(req.district)[3];
        } else if (this.optionSelected == "Divisions" || this.optionSelected == "District" || this.optionSelected == "Division") {
          this.pendingCount = this.divisions.get(req.division)[0];
          this.declinedCount = this.divisions.get(req.division)[1];
          this.confirmedCount = this.divisions.get(req.division)[2];
          this.processingCount = this.divisions.get(req.division)[3];
        }
        this.provinces.set(req.province, [this.provinces.get(req.province)[0] + this.NLevelsofAVisit.get(req.id)[0], this.provinces.get(req.province)[1] + this.NLevelsofAVisit.get(req.id)[1], this.provinces.get(req.province)[2] + this.NLevelsofAVisit.get(req.id)[2], this.provinces.get(req.province)[3] + this.NLevelsofAVisit.get(req.id)[3]])
        this.districts.set(req.district, [this.districts.get(req.district)[0] + this.NLevelsofAVisit.get(req.id)[0], this.districts.get(req.district)[1] + this.NLevelsofAVisit.get(req.id)[1], this.districts.get(req.district)[2] + this.NLevelsofAVisit.get(req.id)[2], this.districts.get(req.district)[3] + this.NLevelsofAVisit.get(req.id)[3]])
        this.divisions.set(req.division, [this.divisions.get(req.division)[0] + this.NLevelsofAVisit.get(req.id)[0], this.divisions.get(req.division)[1] + this.NLevelsofAVisit.get(req.id)[1], this.divisions.get(req.division)[2] + this.NLevelsofAVisit.get(req.id)[2], this.divisions.get(req.division)[3] + this.NLevelsofAVisit.get(req.id)[3]])

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
    this.declinedCount = 0;
    this.pendingCount = 0;
    this.confirmedCount = 0;
    this.fieldvisitReqs.forEach(e => {
      if (e.province == value) {
        if (this.districts.get(e.district) == null) this.districts.set(e.district, [0, 0, 0, 0, 0, 0]);
        // if (e.status == "pending") this.pendingCount++;
        // if (e.status == "declined") this.declinedCount++;
        // if (e.status == "confirmed") this.confirmedCount++;
        // if (e.status == "processing") this.processingCount++;
        // if (e.status == "completed") this.completedCount++;
        this.districts.set(e.district, [this.districts.get(e.district)[0] + this.NLevelsofAVisit.get(e.id)[0], this.districts.get(e.district)[1] + this.NLevelsofAVisit.get(e.id)[1], this.districts.get(e.district)[2] + this.NLevelsofAVisit.get(e.id)[2], this.districts.get(e.district)[3] + this.NLevelsofAVisit.get(e.id)[3]])
      }
      if (e.district == value) {
        // if (e.status == "pending") this.pendingCount++;
        // if (e.status == "declined") this.declinedCount++;
        // if (e.status == "confirmed") this.confirmedCount++;
        // if (e.status == "processing") this.processingCount++;
        // if (e.status == "completed") this.completedCount++;
        if (this.divisions.get(e.division) == null) this.divisions.set(e.division, [0, 0, 0, 0, 0, 0]);
        this.divisions.set(e.division, [this.divisions.get(e.division)[0] + this.NLevelsofAVisit.get(e.id)[0], this.divisions.get(e.division)[1] + this.NLevelsofAVisit.get(e.id)[1], this.divisions.get(e.division)[2] + this.NLevelsofAVisit.get(e.id)[2], this.divisions.get(e.division)[3] + this.NLevelsofAVisit.get(e.id)[3]])
      }
    })

    if (this.optionSelected == 'Province') {
      this.clearTable();
      var fCount = 0;
      this.districts.forEach((value: number[], key: string) => {
        console.log(value + "In Provinceeeee")
        fCount += value[2]; ////
        //fCount--;
        this.values.push({
          key: key,
          pending: value[0],
          confirmed: value[1],
          declined: value[2],
          processing: value[3],
          completed: value[4],
          total: value[5],
        });
        if (this.role == 'field visit req' || this.role == 'field visit') {

          this.fieldvisitReqs.forEach(e => {

            if (e.district == key) {

              this.pendingCount = this.provinces.get(e.province)[0];
              this.declinedCount = this.provinces.get(e.province)[1];
              this.confirmedCount = this.provinces.get(e.province)[2];
              this.processingCount = this.provinces.get(e.province)[3];
              if (this.divisions.get(e.division) == null) this.divisions.set(e.division, [0, 0, 0, 0, 0, 0]);
              this.divisions.set(e.division, [this.divisions.get(e.division)[0] + this.NLevelsofAVisit.get(e.id)[0], this.divisions.get(e.division)[1] + this.NLevelsofAVisit.get(e.id)[1], this.divisions.get(e.division)[2] + this.NLevelsofAVisit.get(e.id)[2], this.divisions.get(e.division)[3] + this.NLevelsofAVisit.get(e.id)[3]])
            }
          })
        }
      });
      this.provinceCount = 1;
      this.districtCount = this.values.length;
      console.log(this.farmerCount + "heereeeeeeeeeeee")
      this.farmerCount = fCount;
      this.divisionCount = this.divisions.size;
      this.column = "District";
    } else if (this.optionSelected == 'District') {
      this.clearTable();

      var fCount = 0;
      this.divisions.forEach((value: number[], key: string) => {
        // if (select == key) {

        fCount += value[2];
        this.values.push({
          key: key,
          pending: value[0],
          confirmed: value[1],
          declined: value[2],
          processing: value[3],
          completed: value[4],
          total: value[5],
        });
        this.pendingCount += value[0];
        this.confirmedCount += value[1];
        this.declinedCount += value[2];
        this.processingCount += value[3];
        this.completedCount += value[4];
        // }
      });
      this.provinceCount = 1;
      this.districtCount = 1;
      this.divisionCount = this.values.length;
      this.farmerCount = fCount;
      this.column = "Division";
    } else if (this.optionSelected == 'Division') {
      this.clearTable();

      var fCount = 0;
      this.divisions.forEach((value: number[], key: string) => {
        if (select == key) {
          fCount += value[2];
          this.values.push({
            key: key,
            pending: value[0],
            confirmed: value[1],
            declined: value[2],
            processing: value[3],
            completed: value[4],
            total: value[5],
          });
        }
        this.pendingCount += value[0];
        this.confirmedCount += value[1];
        this.declinedCount += value[2];
        this.processingCount += value[3];
        this.completedCount += value[4];
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
  round(x: number) {
    return Math.round((x / (this.pendingCount + this.confirmedCount + this.declinedCount + this.processingCount) * 100))
  }

  ngOnInit(): void {
    this.tempCounts = [0, 0, 0, 0, 0, 0];
    this.fieldvisitReqs = [];
    this.pendingCount = 0;
    this.confirmedCount = 0;
    this.declinedCount = 0;
    this.processingCount = 0;
    this.completedCount = 0;


    if (this.role == 'field visit req') {
      this.fieldvisitReqs = [];
      this.fieldvisitReqsInitial = [];
      this.fieldVisitService.getAllAdminFieldVisitRequests().subscribe(data1 => {

        this.fieldDataService.getAllFieldData().subscribe(data => {

          this.fieldData = data.map(e => {
            return {
              ...e.payload.doc.data() as {},
            } as FieldData;
          })
          this.fieldData.forEach(fd => {
            if (this.NLevelsofAVisit.get(fd.requestId) == null)
              this.NLevelsofAVisit.set(fd.requestId, [0, 0, 0, 0]);
            var temp = this.NLevelsofAVisit.get(fd.requestId);
            if (fd.level == 2)
              this.NLevelsofAVisit.set(fd.requestId, [temp[0] + 1, temp[1], temp[2], temp[3]])
            if (fd.level == 3)
              this.NLevelsofAVisit.set(fd.requestId, [temp[0], temp[1] + 1, temp[2], temp[3]])
            if (fd.level == 4)
              this.NLevelsofAVisit.set(fd.requestId, [temp[0], temp[1], temp[2] + 1, temp[3]])
            if (fd.level == 5)
              this.NLevelsofAVisit.set(fd.requestId, [temp[0], temp[1], temp[2], temp[3] + 1])
          })
          this.totalFarmers = data1.length;
          var data1Temp = data1.map(e => {
            return {
              ...e.payload.doc.data() as {},
              id: e.payload.doc.id,
            } as FieldVisitReqTemp;
          })
          data1Temp.forEach(e => {
            var temp = {
              ...e as FieldVisitReqTemp
            }
            this.fieldService.getField(temp.fieldId).subscribe(data => {
              var tfield = data.payload.data() as Field;
              if (tfield.status == "active" && temp.status == "completed") {
                temp.division = tfield.division;
                temp.district = tfield.district;
                temp.province = tfield.province;
                temp.createdDate = temp.visitDate; //
                temp.lvl2 = this.NLevelsofAVisit.get(temp.id)[0];
                temp.lvl3 = this.NLevelsofAVisit.get(temp.id)[1];
                temp.lvl4 = this.NLevelsofAVisit.get(temp.id)[2];
                temp.lvl5 = this.NLevelsofAVisit.get(temp.id)[3];
                this.fieldvisitReqs.push(temp)
                this.fieldvisitReqsInitial.push(temp)

                var date = new Date(temp.createdDate);
                this.years.add(date.getFullYear().toString())
                var monthYr = (date.getMonth() + 1).toString() + " / " + date.getFullYear().toString();
                this.months.add(monthYr)

                if (this.provinces.get(temp.province) == null) this.provinces.set(temp.province, [0, 0, 0, 0]);
                if (this.districts.get(temp.district) == null) this.districts.set(temp.district, [0, 0, 0, 0]);
                if (this.divisions.get(temp.division) == null) this.divisions.set(temp.division, [0, 0, 0, 0]);
                if (this.provincesInitial.get(temp.province) == null) this.provincesInitial.set(temp.province, [0, 0, 0, 0]);
                if (this.districtsInitial.get(temp.district) == null) this.districtsInitial.set(temp.district, [0, 0, 0, 0]);
                if (this.divisionsInitial.get(temp.division) == null) this.divisionsInitial.set(temp.division, [0, 0, 0, 0]);

                this.provinces.set(temp.province, [this.provinces.get(temp.province)[0] + this.NLevelsofAVisit.get(temp.id)[0], this.provinces.get(temp.province)[1] + this.NLevelsofAVisit.get(temp.id)[1], this.provinces.get(temp.province)[2] + this.NLevelsofAVisit.get(temp.id)[2], this.provinces.get(temp.province)[3] + this.NLevelsofAVisit.get(temp.id)[3]])
                this.districts.set(temp.district, [this.districts.get(temp.district)[0] + this.NLevelsofAVisit.get(temp.id)[0], this.districts.get(temp.district)[1] + this.NLevelsofAVisit.get(temp.id)[1], this.districts.get(temp.district)[2] + this.NLevelsofAVisit.get(temp.id)[2], this.districts.get(temp.district)[3] + this.NLevelsofAVisit.get(temp.id)[3]])
                this.divisions.set(temp.division, [this.divisions.get(temp.division)[0] + this.NLevelsofAVisit.get(temp.id)[0], this.divisions.get(temp.division)[1] + this.NLevelsofAVisit.get(temp.id)[1], this.divisions.get(temp.division)[2] + this.NLevelsofAVisit.get(temp.id)[2], this.divisions.get(temp.division)[3] + this.NLevelsofAVisit.get(temp.id)[3]])
                this.provincesInitial.set(temp.province, [this.provincesInitial.get(temp.province)[0] + this.NLevelsofAVisit.get(temp.id)[0], this.provincesInitial.get(temp.province)[1] + this.NLevelsofAVisit.get(temp.id)[1], this.provincesInitial.get(temp.province)[2] + this.NLevelsofAVisit.get(temp.id)[2], this.provincesInitial.get(temp.province)[3] + this.NLevelsofAVisit.get(temp.id)[3]])
                this.districtsInitial.set(temp.district, [this.districtsInitial.get(temp.district)[0] + this.NLevelsofAVisit.get(temp.id)[0], this.districtsInitial.get(temp.district)[1] + this.NLevelsofAVisit.get(temp.id)[1], this.districtsInitial.get(temp.district)[2] + this.NLevelsofAVisit.get(temp.id)[2], this.districtsInitial.get(temp.district)[3] + this.NLevelsofAVisit.get(temp.id)[3]])
                this.divisionsInitial.set(temp.division, [this.divisionsInitial.get(temp.division)[0] + this.NLevelsofAVisit.get(temp.id)[0], this.divisionsInitial.get(temp.division)[1] + this.NLevelsofAVisit.get(temp.id)[1], this.divisionsInitial.get(temp.division)[2] + this.NLevelsofAVisit.get(temp.id)[2], this.divisionsInitial.get(temp.division)[3] + this.NLevelsofAVisit.get(temp.id)[3]])

                // this.pendingCount = this.provinces.get(temp.province)[0];
                // this.declinedCount = this.provinces.get(temp.province)[1];
                // this.confirmedCount = this.provinces.get(temp.province)[2];
                // this.processingCount = this.provinces.get(temp.province)[3];
                // var finalTotal = this.provinces.get(temp.province)[0]+this.provinces.get(temp.province)[1]+this.provinces.get(temp.province)[2]+this.provinces.get(temp.province)[3];
                // console.log(finalTotal+"KLKLKL")
                //add counts
                // if (temp.status == "pending") this.pendingCount++;
                // if (temp.status == "declined") this.declinedCount++;
                // if (temp.status == "confirmed") this.confirmedCount++;
                // if (temp.status == "processing") this.processingCount++;
                // if (temp.status == "completed") this.completedCount++;

              }
              
              console.log(this.provinces)
              this.provinces.forEach(p => {
                // console.log(p + "All Counts of levels for a province")
                // console.log(this.pendingCount)
                this.pendingCount += p[0];
                // console.log(p[0] + "mmm" + this.pendingCount)
                this.confirmedCount += p[1];
                this.declinedCount += p[2];
                this.processingCount += p[3];

              })

              var finalCount = this.pendingCount + this.confirmedCount + this.declinedCount + this.processingCount;
              this.farmerCount = finalCount;
              this.provinceCount = this.provinces.size;
              this.districtCount = this.districts.size;
              this.divisionCount = this.divisions.size;
              this.tempCounts[0] = finalCount;
              this.tempCounts[1] = this.provinces.size;
              this.tempCounts[2] = this.districts.size;
              this.tempCounts[3] = this.divisions.size;
              this.tempCounts[4] = Math.round((this.pendingCount / finalCount) * 100);
              this.tempCounts[5] = Math.round((this.confirmedCount / finalCount) * 100);
              this.tempCounts[6] = Math.round((this.declinedCount / finalCount) * 100);
              this.tempCounts[7] = Math.round((this.processingCount / finalCount) * 100);
              this.tempCounts[8] = Math.round((this.completedCount / finalCount) * 100);
              // console.log(this.tempCounts)

              this.onOptionSelected('Provinces');

            })
            // return temp;
          })
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
              if (this.provinces.get(temp.province) == null) this.provinces.set(temp.province, [0, 0, 0, 0, 0, 0]);
              if (this.districts.get(temp.district) == null) this.districts.set(temp.district, [0, 0, 0, 0, 0, 0]);
              if (this.divisions.get(temp.division) == null) this.divisions.set(temp.division, [0, 0, 0, 0, 0, 0]);
              if (this.provincesInitial.get(temp.province) == null) this.provincesInitial.set(temp.province, [0, 0, 0, 0, 0, 0]);
              if (this.districtsInitial.get(temp.district) == null) this.districtsInitial.set(temp.district, [0, 0, 0, 0, 0, 0]);
              if (this.divisionsInitial.get(temp.division) == null) this.divisionsInitial.set(temp.division, [0, 0, 0, 0, 0, 0]);

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

