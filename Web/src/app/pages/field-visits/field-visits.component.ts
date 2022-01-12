import { FieldVisitTemp } from './../../models/field-visit.model';
import { FieldVisitService } from './../../services/field-visit.service';
import { User } from '../../models/user.model';
import { AfterViewInit, Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from '../../services/user.service';
import { FieldVisit } from '../../models/field-visit.model';
import { Router } from '@angular/router';
import { FieldService } from './../../services/field.service';
import { Field } from 'app/models/field.model';
import divisionalDataFile from '../../../assets/jsonfiles/divisions.json';

@Component({
  selector: 'app-field-visits',
  templateUrl: './field-visits.component.html',
  styleUrls: ['./field-visits.component.css']
})
export class FieldVisitsComponent implements OnInit, AfterViewInit {
  displayedColumns: string[];
  // displayedColumns: string[] = ['registrationNo', 'address', 'farmerName', 'date', 'division', 'requestNote', 'status', 'view', 'delete'];
  dataSource: MatTableDataSource<FieldVisitTemp>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  page = 4;
  page1 = 5;
  focus;
  focus1;
  focus2;
  date: { year: number, month: number };
  model: NgbDateStruct;
  fieldVisits: FieldVisitTemp[];
  fieldVisitsTemp: FieldVisitTemp[];
  data: any[];
  selectedRowIndex;
  fieldVisit: FieldVisit;
  farmer: User;
  field: Field;
  farmerName: any;
  pending = 0;
  declined = 0;
  confirmed = 0;
  processing = 0;
  completed = 0;
  selectedType: String;
  fieldId
  divisionalData = divisionalDataFile;
  provinces;
  // provinces = this.divisionalData.provinces;
  allDistricts = [];
  allDivisions = [];
  districts: any;
  divisions: any;
  provinceSelected: string;
  districtSelected: string;
  divisionSelected: string;
  filterPredicate;
  none: any;

  constructor(private renderer: Renderer2, private fieldVisitService: FieldVisitService, private fieldService: FieldService, private userService: UserService, private router: Router) {
    this.fieldId = this.router.getCurrentNavigation().extras.state.fieldId;
    if (this.fieldId == 'all')
      this.displayedColumns = ['registrationNo', 'address', 'farmerName', 'date', 'province', 'division', 'division', 'requestNote', 'status', 'view', 'delete'];
    else
      this.displayedColumns = ['date', 'requestNote', 'status', 'delete'];

    this.loadLocationFilters();
  }
  loadLocationFilters() {
    this.loadAllProvinces();
    this.loadAllDistricts();
    this.loadAllDivisions();
  }
  loadAllProvinces() {
    this.provinces = ['Province'];
    this.divisionalData.provinces.forEach(pro => {
      this.provinces.push(pro);
    })
    this.provinceSelected = 'Province';
    console.log(this.provinces);
  }
  loadAllDistricts() {
    let val: any;
    var i = 0;
    this.allDistricts = [];
    this.divisionalData.provinces.forEach(pro => {
      val = this.divisionalData["" + pro + ""];
      for (i = 0; i < val.length; i++) {
        this.allDistricts.push(val[i]);
      }
    })
    this.districts = ['District'];
    this.districtSelected = 'District';

    this.allDistricts = this.allDistricts.sort();
    this.allDistricts.forEach(d => {
      this.districts.push(d);
    })
    this.allDistricts = this.districts;
  }
  loadAllDivisions() {
    let val: any;
    var i = 0;
    this.allDivisions = [];
    this.districts.forEach(dis => {
      if (dis != "District") {
        val = this.divisionalData["" + dis + ""];
        console.log(val);
        for (i = 0; i < val.length; i++) {
          this.allDivisions.push(val[i]);
        }
      }
    })
    this.divisions = ['Division'];
    this.divisionSelected = 'Division';
    this.allDivisions = this.allDivisions.sort();
    this.allDivisions.forEach(d => {
      this.divisions.push(d);
    })
    this.allDivisions = this.divisions;

  }
  onProvinceSelected(value: any) {
    this.dataSource.filterPredicate = function (record, filter) {
      return record.province.toLocaleLowerCase() == filter.toLocaleLowerCase();
    }
    var province = value.toString();
    if (province != 'Province') {
      this.districts = ['District'];
      var tempDis = this.divisionalData["" + province + ""];
      tempDis.forEach(element => {
        this.districts.push(element);
      });
      this.divisions = ['Division'];
      var tempDiv = this.divisionalData["" + this.divisionalData["" + province + ""][0] + ""];
      tempDiv.forEach(element => {
        this.divisions.push(element)
      });
      this.dataSource.filter = province;

      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    } else {
      this.districts = this.allDistricts;
      this.divisions = this.allDivisions;
      // if (this.divisionSelected != undefined || this.divisionSelected != 'Division') {
      //   this.dataSource.filterPredicate = function (record, filter) {
      //     return record.division.toLocaleLowerCase() == this.divisionSelected.toLocaleLowerCase();
      //   }
      // } else if (this.districtSelected != undefined || this.districtSelected != 'District') {
      //   this.dataSource.filterPredicate = function (record, filter) {
      //     return record.district.toLocaleLowerCase() == this.districtSelected.toLocaleLowerCase();
      //   }
      // } else
      this.dataSource.filter = "";

      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    }

    console.log("Province" + this.provinceSelected)
    // this.divisionSelected = 'Division';
    // this.districtSelected = 'District';
    console.log("District" + this.districtSelected)
    console.log("Division" + this.divisionSelected)

  }

  onDistrictSelected(value: any) {
    this.dataSource.filterPredicate = function (record, filter) {
      return record.district.toLocaleLowerCase() == filter.toLocaleLowerCase();
    }
    var district = value.toString();
    if (district != 'District') {

      this.divisions = ['Division'];
      var tempDiv = this.divisionalData["" + district + ""];
      tempDiv.forEach(element => {
        this.divisions.push(element)
      });
      this.dataSource.filter = district;

      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }

    } else {
      this.divisions = this.allDivisions;
      // if (this.divisionSelected != undefined || this.divisionSelected != 'Division') {
      //   this.dataSource.filterPredicate = function (record, filter) {
      //     return record.division.toLocaleLowerCase() == this.divisionSelected.toLocaleLowerCase();
      //   }
      // } else if (this.provinceSelected != undefined || this.provinceSelected != 'Province') {
      //   this.dataSource.filterPredicate = function (record, filter) {
      //     return record.province.toLocaleLowerCase() == this.provinceSelected.toLocaleLowerCase();
      //   }
      // } else
      this.dataSource.filter = "";

      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    }
    console.log("Province" + this.provinceSelected)
    console.log("District" + this.districtSelected)
    console.log("Division" + this.divisionSelected)
  }

  onDivisionSelected(value: any) {
    this.dataSource.filterPredicate = function (record, filter) {
      return record.division.toLocaleLowerCase() == filter.toLocaleLowerCase();
    }
    var division = value.toString();
    console.log("Province" + this.provinceSelected)
    console.log(this.districtSelected)
    console.log("Division" + this.divisionSelected)
    if (division != 'Division') {
      this.dataSource.filter = division;
      console.log(this.dataSource.filter)

      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    } else {
      // if (this.districtSelected != 'District') {
      //   console.log('has a selected distric yet')
      //   // this.dataSource.filterPredicate = function (record, filter) {
      //   //   return record.district.toLocaleLowerCase() == this.districtSelected;
      //   // }
      //   // this.dataSource.filter = this.districtSelected;
      // } else if (this.provinceSelected != 'Province') {
      //   console.log('has a selected province yet')
      //   console.log(this.provinceSelected)
      //   this.dataSource.filterPredicate = function (record, filter) {
      //     console.log(record+filter);
      //     console.log(this.provinceSelected);
      //     return record.province == this.provinceSelected;
      //   }
      //   this.dataSource.filter = this.provinceSelected;

      // } else
      this.dataSource.filter = "";

      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    }
    // this.user.division = division;
  }
  isDisabled(date: NgbDateStruct, current: { month: number }) {
    return date.month !== current.month;
  }
  ngAfterViewInit() {
    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
  }
  getRecord(row) {
    this.selectedRowIndex = row.id;
    this.fieldVisit = row;
  }
  viewFieldVisit() {
    this.router.navigate(['/field-visit-details'], { state: { fieldVisit: this.fieldVisit } });
  }
  deleteFieldVisit() {
    // this.fieldVisitService.deleteFieldVisit(this.fieldVisit.id);
  }
  selectReqType() {
    let filterValue;
    if (this.selectedType == "all") {
      filterValue = '';
    } else {
      filterValue = this.selectedType;
    }
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  async ngOnInit() {
    this.fieldVisitsTemp = [];
    let input_group_focus = document.getElementsByClassName('form-control');
    let input_group = document.getElementsByClassName('input-group');
    for (let i = 0; i < input_group.length; i++) {
      input_group[i].children[0].addEventListener('focus', function () {
        input_group[i].classList.add('input-group-focus');
      });
      input_group[i].children[0].addEventListener('blur', function () {
        input_group[i].classList.remove('input-group-focus');
      });
    }

    this.fieldVisitService.getFieldVisits(this.fieldId).subscribe(data => {
      this.fieldVisitsTemp = data.map(e => {
        console.log(this.fieldVisit)
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data() as {}
        } as FieldVisitTemp;
      })
      this.fieldVisits = [];

      this.fieldVisitsTemp.forEach(f => {
        if (f.status == 'pending') this.pending += 1;
        else if (f.status == 'confirmed') this.confirmed += 1;
        else if (f.status == 'processing') this.processing += 1;
        else if (f.status == 'completed') this.completed += 1;
        else if (f.status == 'declined') this.declined += 1;


        this.fieldService.getField(f.fieldId).subscribe(data => {
          this.field = data.payload.data() as Field;
          if (this.field.status == 'active') {
            f.field = this.field;
            f.address = this.field.address;
            f.district = this.field.district;
            f.province = this.field.province;
            f.registrationNo = this.field.registrationNumber;
            this.userService.getUser(this.field.farmerId).subscribe(data => {
              this.farmer = data.payload.data() as User;
              f.farmer = this.farmer;

              f.farmerName = this.farmer.firstName + " " + this.farmer.lastName;
              this.fieldVisits.push(f);
              this.dataSource = new MatTableDataSource(this.fieldVisits);
              this.dataSource.paginator = this.paginator;
              this.dataSource.sort = this.sort;
              this.filterPredicate = this.dataSource.filterPredicate;

            });
          }


          // this.dataSource = new MatTableDataSource(this.fieldVisits);
          // this.dataSource.paginator = this.paginator;
          // this.dataSource.sort = this.sort;

        });

      })

    });

  }


}

