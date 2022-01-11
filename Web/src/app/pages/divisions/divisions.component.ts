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
  pending = 0;
  declined = 0;
  active = 0;
  inactive = 0;
  field;

  constructor(private renderer: Renderer2, private userService: UserService, private fieldService: FieldService, private router: Router) {
    this.role = this.router.getCurrentNavigation().extras.state.role;
    this.displayedColumns = ['division', 'province', 'district', 'view'];

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
  // deleteUser() {
  //   this.userService.deleteUser(this.user.id);
  // }
  // accept() {
  //   this.userService.changeUserStatus(this.user.id, 'active');
  // }
  // deactivate() {
  //   // this.userService.changeUserStatus(this.user.id, 'inactive')
  //   // this.fieldService.getFieldofFarmer(this.user.id).subscribe(data => {  
  //   this.userService.changeuserActivation(this.user.id, this.field, 'inactive');

  //   // })
  // }
  // decline() {
  //   this.userService.changeUserStatus(this.user.id, 'declined');
  // }
  // selectReqType() {
  //   let filterValue;
  //   if (this.selectedType == "all") {
  //     filterValue = '';
  //   } else {
  //     filterValue = this.selectedType;
  //   }

  //   this.dataSource.filter = filterValue.trim().toLowerCase();

  //   if (this.dataSource.paginator) {
  //     this.dataSource.paginator.firstPage();
  //   }
  // }
  // getCounts() {
  //   if (this.type == 'request') {
  //     this.users.forEach(data => {
  //       if (data.status == 'pending') {
  //         this.pending++;
  //       } else {
  //         this.declined++;
  //       }
  //     });
  //     this.all = this.declined + this.pending;
  //   } else {
  //     this.users.forEach(data => {
  //       if (data.status == 'active') {
  //         this.active++;
  //       } else {
  //         this.inactive++;
  //       }
  //     });
  //     this.all = this.declined + this.pending;
  //   }
  // }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    console.log(filterValue)
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
      // this.getCounts();
    });

  }


}