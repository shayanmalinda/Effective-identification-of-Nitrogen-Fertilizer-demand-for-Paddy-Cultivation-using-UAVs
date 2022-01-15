import { FieldService } from 'app/services/field.service';
import { UserTemp } from './../../models/user.model';
import { AfterViewInit, Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { Router } from '@angular/router';
import divisionalDataFile from '../../../assets/jsonfiles/divisions.json';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})

export class UsersComponent implements OnInit {
  displayedColumns: string[];
  // = ['name', 'email', 'phone', 'nic', 'province','district','division','view','delete'];
  dataSource: MatTableDataSource<UserTemp>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  page = 4;
  page1 = 5;
  focus;
  focus1;
  focus2;
  date: { year: number, month: number };
  model: NgbDateStruct;
  users: UserTemp[];
  data: any[];
  selectedRowIndex;
  user: UserTemp;
  type;
  title;
  role;
  none: any;
  // status;
  selectedType: String;
  all = 0;
  pending = 0;
  declined = 0;
  active = 0;
  inactive = 0;
  field;
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
  filterValue = '';
  constructor(private renderer: Renderer2, private userService: UserService, private fieldService: FieldService, private router: Router) {
    this.type = this.router.getCurrentNavigation().extras.state.type;
    this.role = this.router.getCurrentNavigation().extras.state.role;
    this.title = this.role;

    if (this.type != 'request') {
      this.title += "s";
      console.log(this.role)
      if (this.role == 'farmer')
        this.displayedColumns = ['firstName', 'lastName', 'email', 'phone', 'nic', 'province', 'district', 'division', 'status', 'view', 'deactivate', 'reactivate', 'delete'];
      else
        this.displayedColumns = ['firstName', 'lastName', 'email', 'phone', 'nic', 'province', 'district', 'division', 'status', 'view', 'delete'];
    } else {
      this.title += " requests";
      // if (this.role == 'farmer') {
      //   this.displayedColumns = ['firstName', 'lastName', 'email', 'phone', 'nic', 'province', 'district', 'division', 'time', 'status', 'view', 'delete'];
      // } else
      this.displayedColumns = ['firstName', 'lastName', 'email', 'phone', 'nic', 'province', 'district', 'division', 'time', 'status', 'view', 'accept', 'decline', 'delete'];
    }

    this.loadLocationFilters();
  }
  loadLocationFilters() {
    this.loadAllProvinces();
    this.loadAllDistricts();
    this.loadAllDivisions();
  }


  ngAfterViewInit() {
    //   this.dataSource.paginator = this.paginator;
    //   this.dataSource.sort = this.sort;
  }

  getFileName() {
    let name = ''

    if (this.type == 'request') {
      name += 'Officer Requests'
    } else if (this.role == 'farmer') {
      name += 'Farmers'
    } else {
      name += 'Officers'
    }

    if (this.divisionSelected != 'Division') {
      name += '-' + this.divisionSelected + ' division';
    }
    else if (this.districtSelected != 'District') {
      name += '-' + this.districtSelected + ' district';
    }
    else if (this.provinceSelected != 'Province') {
      name += '-' + this.provinceSelected + ' province';
    }
    if (this.filterValue != '') {
      name += ' (Filter :' + this.filterValue + ')';
    }
    name += ' report'
    return name;

  }
  getRecord(row) {
    this.selectedRowIndex = row.id;
    console.log(this.selectedRowIndex)
    this.user = row;
    this.fieldService.getFieldofFarmer(this.user.id).subscribe(data => {
      data.forEach(e => {
        // return {
        this.field = e.payload.doc.id;//
        // } 
      })
    })
  }
  viewUser() {
    console.log(this.user)

    if (this.type == 'request')
      this.router.navigate(['/farmer-request'], { state: { user: this.user, id: this.user.id, type: this.type } });
    else
      this.router.navigate(['/farmer-profile'], { state: { user: this.user, id: this.user.id, type: this.type } });

  }
  deleteUser() {
    this.userService.deleteUser(this.user.id);
  }
  accept() {
    this.userService.changeUserStatus(this.user.id, 'active');
  }
  deactivate() {
    // this.userService.changeUserStatus(this.user.id, 'inactive')
    // this.fieldService.getFieldofFarmer(this.user.id).subscribe(data => {  
    this.userService.changeuserActivation(this.user.id, this.field, 'inactive');

    // })
  }
  decline() {
    this.userService.changeUserStatus(this.user.id, 'declined');
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
  getCounts() {
    if (this.type == 'request') {
      this.users.forEach(data => {
        if (data.status == 'pending') {
          this.pending++;
        } else {
          this.declined++;
        }
      });
      this.all = this.declined + this.pending;
    } else {
      this.users.forEach(data => {
        if (data.status == 'active') {
          this.active++;
        } else {
          this.inactive++;
        }
      });
      this.all = this.declined + this.pending;
    }
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filterValue = filterValue;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  ngOnInit() {
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

    // if (this.type == "request") {// pending declined
    //   this.status = "pending"
    // } else {// active inactive
    //   this.status = "approved"
    // }
    console.log(this.role)
    this.userService.getUsers(this.role, this.type).subscribe(data => {
      this.users = data.map(e => {
        return {
          ...e.payload.doc.data() as {},
          id: e.payload.doc.id,
        } as UserTemp;
      })
      console.log(this.users)
      this.dataSource = new MatTableDataSource(this.users);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.filterPredicate = this.dataSource.filterPredicate;

      this.getCounts();
    });

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


}