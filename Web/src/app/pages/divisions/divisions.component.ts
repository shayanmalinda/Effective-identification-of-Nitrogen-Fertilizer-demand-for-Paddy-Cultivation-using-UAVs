import { Field } from 'app/models/field.model';
import { FieldService } from 'app/services/field.service';
import { UserTemp } from '../../models/user.model';
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
  selector: 'app-divisions',
  templateUrl: './divisions.component.html',
  styleUrls: ['./divisions.component.css']
})

export class DivisionsComponent implements OnInit {
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
  // status;
  selectedType: String;
  all = 0;
  none: any;
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
  constructor(private renderer: Renderer2, private userService: UserService, private fieldService: FieldService, private router: Router) {
    this.role = this.router.getCurrentNavigation().extras.state.role;
    this.displayedColumns = ['division', 'province', 'district', 'view'];
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
  getRecord(row) {
    this.user = row;
    this.selectedRowIndex = row.id;
    // console.log(this.selectedRowIndex)
    // this.user = row;
    // this.fieldService.getFieldofFarmer(this.user.id).subscribe(data => {
    //   data.forEach(e => {
    //     // return {
    //     this.field = e.payload.doc.id;//
    //     // } 
    //   })
    // })
  }
  viewDistrictDetails() {
    console.log(this.user)
    this.router.navigate(['/division-details'], { state: { user: this.user } });

  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    console.log(filterValue)
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  loadAllProvinces() {
    this.provinces = ['Province'];
    this.divisionalData.provinces.forEach(pro => {
      this.provinces.push(pro);
    })
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
    this.allDivisions = this.allDivisions.sort();
    this.allDivisions.forEach(d => {
      this.divisions.push(d);
    })
    this.allDivisions = this.divisions;

  }

  // loadDistrictSelected(value: any) { ////

  //   var province = value.toString();
  //   if (province == 'Province')
  //     this.districts = this.allDistricts;
  //   else
  //     this.districts = this.divisionalData["" + province + ""];
  // }

  // loadDivisionSelected(value: any) { ////
  //   var district = value.toString();
  //   if (district == 'District')
  //     this.divisions = this.allDivisions;
  //   else
  //     this.divisions = this.divisionalData["" + district + ""]
  // }

  onProvinceSelected(value: any) {
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
    } else {
      this.districts = this.allDistricts;
      this.divisions = this.allDivisions;
    }

  }

  onDistrictSelected(value: any) {
    var district = value.toString();
    if (district != 'District') {

      this.divisions = ['Division'];
      var tempDiv = this.divisionalData["" + district + ""];
      tempDiv.forEach(element => {
        this.divisions.push(element)
      });
    } else {
      this.divisions = this.allDivisions;
    }
  }

  onDivisionSelected(value: any) {
    var division = value.toString();
    // this.user.division = division;
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
      // this.getCounts();
    });

  }


}