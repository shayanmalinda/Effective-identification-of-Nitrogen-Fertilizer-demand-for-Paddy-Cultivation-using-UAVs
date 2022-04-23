import { FieldTemp } from './../../models/field.model';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Counts } from 'app/models/user.model';
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
  selector: 'app-admin-farmer-reports-farmers',
  templateUrl: './admin-farmer-reports-farmers.component.html',
  styleUrls: ['./admin-farmer-reports-farmers.component.css']
})
export class AdminFarmerReportsComponent implements OnInit {
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


  dataSource: MatTableDataSource<Counts>;
  farmerCount;
  provinceCount;
  districtCount;
  divisionCount;
  fieldvisits: FieldVisitReqTemp[];
  tempCounts = [0, 0, 0, 0];
  reportType = "Farmers Report";
  changedWeekDetails: LCCWeekDetails[];
  lccMainDetails: LCCMainDetails;
  havePreviousRecords: boolean = false;
  divisionalData = divisionalDataFile;
  list;
  periods;
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
  provinces: Map<string, number> = new Map<string, number>();
  districts: Map<string, number> = new Map<string, number>();
  divisions: Map<string, number> = new Map<string, number>();
  provincesActive: Map<string, number> = new Map<string, number>();
  districtsActive: Map<string, number> = new Map<string, number>();
  divisionsActive: Map<string, number> = new Map<string, number>();
  values: Counts[] = [];
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
  // dataSource: MatTableDataSource<User>;

  constructor(private router: Router, private userService: UserService, private datepipe: DatePipe, private userFarmersService: UserFarmersService, private fieldService: FieldService, private fieldVisitService: FieldVisitService) {
    this.date = this.datepipe.transform((new Date), 'MMM d, y').toString();
    this.optionSelected = 'Provinces'
    this.timeSelected = 'All';
    this.displayedColumns = ['key', 'value'];
    this.role = this.router.getCurrentNavigation().extras.state.role;
    if (this.role == 'farmer') {
      this.documentName = "Farmers Report";
      this.name = "Farmers";
    }

    else if (this.role == 'agricultural officer') {
      this.documentName = "Agricultural Officer Report";
      this.name = "Officers";

    }
    else if (this.role == 'field') {
      this.documentName = "Field Report";
      this.name = "Fields";

    }

  }
  clearTable() {
    this.values = [];
    this.dataSource = new MatTableDataSource(this.values);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  onTimeOptionSelected(value: any) {
    this.values = [];
    var province = value.toString();
    if (this.timeSelected == 'Month') {
      this.periods = this.months;
    } else if (this.timeSelected == 'Year') {
      this.periods = this.years;
    }
  }

  onOptionSelected(value: any) {
    this.values = [];
    var province = value.toString();
    if (this.optionSelected == 'Provinces') {
      this.provinces.forEach((value: number, key: string) => {
        this.values.push({
          key: key,
          value: value
        });
      });

      this.dataSource = new MatTableDataSource(this.values);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.farmerCount = this.tempCounts[0];
      this.provinceCount = this.tempCounts[1];
      this.districtCount = this.tempCounts[2];
      this.divisionCount = this.tempCounts[3];
      this.column = "Province";

    } else if (this.optionSelected == 'Districts') {
      this.districts.forEach((value: number, key: string) => {
        this.values.push({
          key: key,
          value: value
        });
      });

      this.dataSource = new MatTableDataSource(this.values);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.farmerCount = this.tempCounts[0];
      this.provinceCount = this.tempCounts[1];
      this.districtCount = this.tempCounts[2];
      this.divisionCount = this.tempCounts[3];
      this.column = "District";

    }
    else if (this.optionSelected == 'Province') {
      this.clearTable();
      this.list = Array.from(this.provincesActive.keys()).sort();;
      this.farmerCount = 0;
      this.provinceCount = 0;
      this.districtCount = 0;
      this.divisionCount = 0;

    }
    else if (this.optionSelected == 'District') {
      this.clearTable();
      this.farmerCount = 0;
      this.provinceCount = 0;
      this.districtCount = 0;
      this.divisionCount = 0;
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

      this.divisions.forEach((value: number, key: string) => {
        this.values.push({
          key: key,
          value: value
        });
      });

      this.farmerCount = this.tempCounts[0];
      this.provinceCount = this.tempCounts[1];
      this.districtCount = this.tempCounts[2];
      this.divisionCount = this.tempCounts[3];
      this.dataSource = new MatTableDataSource(this.values);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.column = "Division";
    }

  }
  onMonthorYearSelected(value: any) {
    var select = value.toString();
    //should filter dates from the month and year seperatly

  }

  onValueSelected(value: any) {
    var select = value.toString();
    this.districts.clear();
    this.divisions.clear();
    if (this.role == 'agricultural officer' || this.role == 'farmer') {
      this.users.forEach(e => {
        if (e.province == value)
          this.districts.set(e.district, this.districts.get(e.district) == null ? 1 : this.districts.get(e.district) + 1);
        if (e.district == value)
          this.divisions.set(e.division, this.divisions.get(e.division) == null ? 1 : this.divisions.get(e.division) + 1);
      })
    } else if (this.role == 'field') {
      this.fields.forEach(e => {
        if (e.province == value)
          this.districts.set(e.district, this.districts.get(e.district) == null ? 1 : this.districts.get(e.district) + 1);
        if (e.district == value)
          this.divisions.set(e.division, this.divisions.get(e.division) == null ? 1 : this.divisions.get(e.division) + 1);
      })
    }


    if (this.optionSelected == 'Province') {
      var fCount = 0;
      this.districts.forEach((value: number, key: string) => {
        fCount += value;
        this.values.push({
          key: key,
          value: value
        });
        if (this.role == 'field visit req' || this.role == 'field visit') {
          this.fieldvisitReqs.forEach(e => {

            if (e.district == key)
              this.divisions.set(e.division, this.divisions.get(e.division) == null ? 1 : this.divisions.get(e.division) + 1);
          })
        } else {
          if (this.role == 'agricultural officer' || this.role == 'farmer')
            this.users.forEach(e => {

              if (e.district == key)
                this.divisions.set(e.division, this.divisions.get(e.division) == null ? 1 : this.divisions.get(e.division) + 1);
            })
          else if (this.role == 'field')
            this.fields.forEach(e => {

              if (e.district == key)
                this.divisions.set(e.division, this.divisions.get(e.division) == null ? 1 : this.divisions.get(e.division) + 1);
            })
        }
      });
      this.provinceCount = 1;
      this.districtCount = this.values.length;
      this.farmerCount = fCount;
      this.divisionCount = this.divisions.size;
      this.column = "District";


    }

    else if (this.optionSelected == 'District') {
      var fCount = 0;
      this.divisions.forEach((value: number, key: string) => {
        fCount += value;
        this.values.push({
          key: key,
          value: value
        });
      });
      this.provinceCount = 1;
      this.districtCount = 1;
      this.divisionCount = this.values.length;
      this.farmerCount = fCount;
      this.column = "Division";
    } else if (this.optionSelected == 'Division') {
      var fCount = 0;
      this.divisions.forEach((value: number, key: string) => {
        if (select == key) {
          fCount += value;
          this.values.push({
            key: key,
            value: value
          });
        }
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
    this.tempCounts = [0, 0, 0, 0];
    this.fieldvisitReqs = [];

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

    if (this.role == 'farmer') {
      this.userService.getActiveUsers(this.role).subscribe(data => {
        this.totalFarmers = data.length;
        this.users = data.map(e => {
          return {
            ...e.payload.doc.data() as {},
            id: e.payload.doc.id,
          } as UserTemp;
        })
        this.users.forEach(e => {
          this.fieldService.getFieldofFarmer(e.id).subscribe(f => {
            this.userField = f.map(val => {
              return {
                ...val.payload.doc.data() as {},
              } as Field;
            })
            e.province = this.userField[0].province;
            e.district = this.userField[0].district;
            e.division = this.userField[0].division;
            this.provinces.set(e.province, this.provinces.get(e.province) == null ? 1 : this.provinces.get(e.province) + 1);
            this.districts.set(e.district, this.districts.get(e.district) == null ? 1 : this.districts.get(e.district) + 1);
            this.divisions.set(e.division, this.divisions.get(e.division) == null ? 1 : this.divisions.get(e.division) + 1);

            this.farmerCount = this.users.length;
            this.provinceCount = this.provinces.size;
            this.districtCount = this.districts.size;
            this.divisionCount = this.divisions.size;
            this.tempCounts[0] = this.users.length;
            this.tempCounts[1] = this.provinces.size;
            this.tempCounts[2] = this.districts.size;
            this.tempCounts[3] = this.divisions.size;

            this.onOptionSelected('Provinces');
          })
        });



      });
    } else if (this.role == 'agricultural officer') {
      this.userService.getActiveUsers(this.role).subscribe(data => {
        this.totalFarmers = data.length;
        this.users = data.map(e => {
          return {
            ...e.payload.doc.data() as {},
            id: e.payload.doc.id,
          } as UserTemp;
        })

        this.users.forEach(e => {
          this.provinces.set(e.province, this.provinces.get(e.province) == null ? 1 : this.provinces.get(e.province) + 1);
          this.districts.set(e.district, this.districts.get(e.district) == null ? 1 : this.districts.get(e.district) + 1);
          this.divisions.set(e.division, this.divisions.get(e.division) == null ? 1 : this.divisions.get(e.division) + 1);
        })
        this.farmerCount = this.users.length;
        this.provinceCount = this.provinces.size;
        this.districtCount = this.districts.size;
        this.divisionCount = this.divisions.size;
        this.tempCounts[0] = this.users.length;
        this.tempCounts[1] = this.provinces.size;
        this.tempCounts[2] = this.districts.size;
        this.tempCounts[3] = this.divisions.size;

        this.onOptionSelected('Provinces');


      });
    } else if (this.role == 'field') {
      this.fieldService.getActiveFields().subscribe(data => {
        this.totalFarmers = data.length;
        this.fields = data.map(e => {
          return {
            ...e.payload.doc.data() as {},
          } as Field;
        })

        this.fields.forEach(e => {
          this.provinces.set(e.province, this.provinces.get(e.province) == null ? 1 : this.provinces.get(e.province) + 1);
          this.districts.set(e.district, this.districts.get(e.district) == null ? 1 : this.districts.get(e.district) + 1);
          this.divisions.set(e.division, this.divisions.get(e.division) == null ? 1 : this.divisions.get(e.division) + 1);
        })
        this.farmerCount = this.fields.length;
        this.provinceCount = this.provinces.size;
        this.districtCount = this.districts.size;
        this.divisionCount = this.divisions.size;
        this.tempCounts[0] = this.fields.length;
        this.tempCounts[1] = this.provinces.size;
        this.tempCounts[2] = this.districts.size;
        this.tempCounts[3] = this.divisions.size;

        this.onOptionSelected('Provinces');


      });
    }
  }
}

