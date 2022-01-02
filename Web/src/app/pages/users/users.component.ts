import { AfterViewInit, Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { Router } from '@angular/router';

export interface UserData {
  id: string;
  name: string;
  progress: string;
  fruit: string;
}

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})

export class UsersComponent implements OnInit, AfterViewInit {
  displayedColumns: string[];
  // = ['name', 'email', 'phone', 'nic', 'province','district','division','view','delete'];
  dataSource: MatTableDataSource<User>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  page = 4;
  page1 = 5;
  focus;
  focus1;
  focus2;
  date: { year: number, month: number };
  model: NgbDateStruct;
  users: User[];
  data: any[];
  selectedRowIndex;
  user: User;
  type;
  title;
  role;
  status;
  selectedType: String;
  all = 0;
  pending = 0;
  declined = 0;
  constructor(private renderer: Renderer2, private userService: UserService, private router: Router) {
    this.type = this.router.getCurrentNavigation().extras.state.type;
    this.role = this.router.getCurrentNavigation().extras.state.role;
    this.title = this.role;
    if (this.type != 'request') {
      this.title += "s";

      this.displayedColumns = ['firstName', 'lastName', 'email', 'phone', 'nic', 'province', 'district', 'division', 'view', 'delete'];
    } else {
      this.title += " requests";

      if (this.role == 'farmer') {

        this.displayedColumns = ['firstName', 'lastName', 'email', 'phone', 'nic', 'province', 'district', 'division', 'time', 'status', 'view', 'delete'];
      } else
        this.displayedColumns = ['firstName', 'lastName', 'email', 'phone', 'nic', 'province', 'district', 'division', 'time', 'status', 'view', 'accept', 'decline', 'delete'];
    }

  }

  isWeekend(date: NgbDateStruct) {
    const d = new Date(date.year, date.month - 1, date.day);
    return d.getDay() === 0 || d.getDay() === 6;
  }

  isDisabled(date: NgbDateStruct, current: { month: number }) {
    return date.month !== current.month;
  }
  ngAfterViewInit() {
    //   this.dataSource.paginator = this.paginator;
    //   this.dataSource.sort = this.sort;
  }
  getRecord(row) {
    this.selectedRowIndex = row.id;
    console.log(this.selectedRowIndex)
    this.user = row;
  }
  viewUser() {
    if (this.type == 'request')
      this.router.navigate(['/farmer-request'], { state: { user: this.user } });
    else
      this.router.navigate(['/farmer-profile'], { state: { user: this.user } });// should be changed to profile with updates

  }
  deleteUser() {
    this.userService.deleteUser(this.user.id);
  }
  accept() {
    this.userService.acceptUser(this.user.id);
  }
  decline() {
    this.userService.declineUser(this.user.id);
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

    this.users.forEach(data => {
      if (data.status == 'pending') {
        this.pending++;
      } else {
        this.declined++;
      }
    });
    this.all = this.declined + this.pending;
  }


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

    if (this.type == "request") {
      this.status = "pending"
    } else {
      this.status = "approved"
    }
    console.log(this.role)
    this.userService.getUsers(this.role, this.status).subscribe(data => {
      this.users = data.map(e => {
        console.log(e.payload.doc.id+"IIIIIIDDDDD");
        return {
          ...e.payload.doc.data() as {},
          id: e.payload.doc.id,
        } as User;
      })
      console.log(this.users)
      this.dataSource = new MatTableDataSource(this.users);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.getCounts();
    });

  }


}