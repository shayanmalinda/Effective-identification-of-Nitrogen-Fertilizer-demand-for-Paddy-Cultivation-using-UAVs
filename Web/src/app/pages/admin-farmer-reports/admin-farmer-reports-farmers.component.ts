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
import { UserService } from '../../services/user.service';
import divisionalDataFile from '../../../assets/jsonfiles/divisions.json';

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

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  dataSource: MatTableDataSource<Counts>;
  farmerCount;
  provinceCount;
  districtCount;
  divisionCount;
  reportType = "Farmers Report";
  changedWeekDetails: LCCWeekDetails[];
  lccMainDetails: LCCMainDetails;
  havePreviousRecords: boolean = false;
  divisionalData = divisionalDataFile;
  list;
  userField: Field[];
  approved = 0;
  declined = 0;
  pending = 0;
  all = 0;
  fields: Field[];
  passedUser: User;
  length = false;
  totalFarmers;
  provinces: Map<string, number> = new Map<string, number>();
  districts: Map<string, number> = new Map<string, number>();
  divisions: Map<string, number> = new Map<string, number>();
  values: Counts[] = [];
  none;
  focus1;
  optionSelected;
  proviceSelected;
  displayedColumns;
  selections = ['Provinces', 'Districts', 'Divisions', 'Province', 'District'];
  // dataSource: MatTableDataSource<User>;

  constructor(private userService: UserService, private datepipe: DatePipe, private userFarmersService: UserFarmersService, private fieldService: FieldService) {
    this.date = this.datepipe.transform((new Date), 'MMM d, y').toString();
    this.documentName = "Farmers Report";
    this.optionSelected = 'Provinces'
    this.displayedColumns = ['key', 'value'];

  }
  clearTable() {
    this.values = [];
    this.dataSource = new MatTableDataSource(this.values);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  onOptionSelected(value: any) {
    this.values = [];
    var province = value.toString();
    if (this.optionSelected == 'Provinces') {
      this.provinces.forEach((value: number, key: string) => {
        console.log(key, value);
        this.values.push({
          key: key,
          value: value
        });
      });

      console.log(this.values)
      this.dataSource = new MatTableDataSource(this.values);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    } else if (this.optionSelected == 'Districts') {
      this.districts.forEach((value: number, key: string) => {
        console.log(key, value);
        this.values.push({
          key: key,
          value: value
        });
      });

      console.log(this.values)
      this.dataSource = new MatTableDataSource(this.values);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
    else if (this.optionSelected == 'Province') {
      this.clearTable();
      this.list = this.divisionalData.provinces;

    }
    else if (this.optionSelected == 'District') {
      this.clearTable();

      this.list = this.divisionalData.provinces;
      let val, i;
      let allDistricts = [];
      this.divisionalData.provinces.forEach(pro => {
        val = this.divisionalData["" + pro + ""];
        for (i = 0; i < val.length; i++) {
          allDistricts.push(val[i]);
        }
      })
      this.list = allDistricts.sort();
    }
    else if (this.optionSelected == 'Divisions') { // has to implement
      console.log('Devision Selected')
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
        console.log(val);
        for (i = 0; i < val.length; i++) {
          allDivisions.push(val[i]);
        }
        // }
      })
      this.list = allDivisions.sort; // add divisions to dropdown

      this.divisions.forEach((value: number, key: string) => {
        console.log(key, value);
        this.values.push({
          key: key,
          value: value
        });
      });

      console.log(this.values)
      this.dataSource = new MatTableDataSource(this.values);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;


    }
  }

  onValueSelected(value: any) {
    var select = value.toString();
    this.districts.clear();
    this.divisions.clear();

    console.log(value)
    this.users.forEach(e => {
      if (e.province == value)
        this.districts.set(e.district, this.districts.get(e.district) == null ? 1 : this.districts.get(e.district) + 1);
      if (e.district == value) this.divisions.set(e.division, this.divisions.get(e.division) == null ? 1 : this.divisions.get(e.division) + 1);
    })

    if (this.optionSelected == 'Province')
      this.districts.forEach((value: number, key: string) => {
        console.log(key, value);

        this.values.push({
          key: key,
          value: value
        });
      });
    else
      this.divisions.forEach((value: number, key: string) => {
        console.log(key, value);

        this.values.push({
          key: key,
          value: value
        });
      });
    console.log(this.values)
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

  ngOnInit(): void {

    this.userService.getActiveUsers('farmer').subscribe(data => {
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
            console.log(val.payload.doc.data())
            return {
              ...val.payload.doc.data() as {},
            } as Field;
          })
          e.province = this.userField[0].province;
          e.district = this.userField[0].district;
          e.division = this.userField[0].division;
          console.log(e.district)
          this.provinces.set(e.province, this.provinces.get(e.province) == null ? 1 : this.provinces.get(e.province) + 1);
          this.districts.set(e.district, this.districts.get(e.district) == null ? 1 : this.districts.get(e.district) + 1);
          this.divisions.set(e.division, this.divisions.get(e.division) == null ? 1 : this.divisions.get(e.division) + 1);

          console.log(this.userField[0].province)
          console.log(this.users)

          // this.users.forEach(e => {
          //   console.log(e.district)
          //   this.provinces.set(e.province, this.provinces.get(e.province) == null ? 1 : this.provinces.get(e.province) + 1);
          //   this.districts.set(e.district, this.districts.get(e.district) == null ? 1 : this.districts.get(e.district) + 1);
          //   this.divisions.set(e.division, this.divisions.get(e.division) == null ? 1 : this.divisions.get(e.division) + 1);
          // })
          this.farmerCount = this.users.length;
          this.provinceCount = this.provinces.size;
          this.districtCount = this.districts.size;
          this.divisionCount = this.divisions.size;
    
          this.onOptionSelected('Provinces');
        })
      });
    


    });



  }
}




