import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Message } from 'app/models/message.model';
import { User, UserCredential } from 'app/models/user.model';

export interface PeriodicElement {
  levelOne: string;
  week: number;
  levelTwo: number;
  levelThree: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {week: 1, levelOne: 'Hydrogen', levelTwo: 1.0079, levelThree: 'H'},
  {week: 2, levelOne: 'Helium', levelTwo: 4.0026, levelThree: 'He'},
  {week: 3, levelOne: 'Lithium', levelTwo: 6.941, levelThree: 'Li'},
  {week: 4, levelOne: 'Beryllium', levelTwo: 9.0122, levelThree: 'Be'},
  {week: 5, levelOne: 'Boron', levelTwo: 10.811, levelThree: 'B'},
  {week: 6, levelOne: 'Carbon', levelTwo: 12.0107, levelThree: 'C'},
  {week: 5, levelOne: 'Boron', levelTwo: 10.811, levelThree: 'B'},
  {week: 6, levelOne: 'Carbon', levelTwo: 12.0107, levelThree: 'C'}
];

@Component({
  selector: 'app-lcc-details',
  templateUrl: './lcc-details.component.html',
  styleUrls: ['./lcc-details.component.css']
})
export class LccDetailsComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort : MatSort;

  user : User = {
    id : '',
    email: '',
    firstName: '',
    lastName: '',
    nic: '',
    phone: '',
    userRole: '',
    district: '',
    division: '',
    province: '',          
    image : '',      
    status : '',      
    time : '',        
    name : '',
    registeredDate : '',
  };

  userCredential : UserCredential = {
    email : '',
    password : '',
    userID : '',
  };

  message : Message = {
    title : '',
    showMessage : ''
  }

  displayedColumns: string[] = ['week', 'levelOne', 'levelTwo', 'levelThree'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);

  constructor() { }

  ngOnInit(): void {
    this.loadSessionDetails();
    setTimeout(() => this.dataSource.paginator = this.paginator);
    setTimeout(() => this.dataSource.sort = this.sort);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  clickOn(row){
    console.log(row);
  }

  applyFilter(filterValue : string){
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onSaveClick(row){
    // // console.log(this.user.image);
    // // this.userService.logInUser(this.user);
    // // this.userService.saveUserDetails(this.userCredential, this.user);
    // console.log(this.userCredential);
    // console.log(this.user)
    // this.userService.saveUserDetails(this.userCredential, this.user)
    // .then(res => {
    //   this.message.title = "success";
    //   this.message.showMessage = "You have successfully updated the user details !";
    //   this.dialog.openConfirmDialog(this.message).afterClosed().subscribe(res =>{
    //   this.updateSessionDetails();
    //   this.router.navigate(['/profile']);
    //   });
    // }, err => {
    //   this.message.title = "error";
    //   this.message.showMessage = err;
    //   this.dialog.openConfirmDialog(this.message).afterClosed().subscribe(res =>{
    //   this.clearFields();
    // })});
    console.log(row);
  }

  loadSessionDetails(){
    this.userCredential.userID = sessionStorage.getItem('userID');
    this.user.status = sessionStorage.getItem('status');
    this.user.firstName = (sessionStorage.getItem("firstName") != "" ? sessionStorage.getItem("firstName") : "");
    this.user.lastName = (sessionStorage.getItem("lastName") != "" ? sessionStorage.getItem("lastName") : "");
    this.user.nic = (sessionStorage.getItem("nic") != "" ? sessionStorage.getItem("nic") : "");
    this.user.email = (sessionStorage.getItem("email") != "" ? sessionStorage.getItem("email") : "");
    this.user.userRole = (sessionStorage.getItem("userRole") != "" ? sessionStorage.getItem("userRole") : "");
    this.user.phone = (sessionStorage.getItem("phone") != "" ? sessionStorage.getItem("phone") : "");
    this.user.division = (sessionStorage.getItem("division") != "" ? sessionStorage.getItem("division") : "");
    this.user.district = (sessionStorage.getItem("district") != "" ? sessionStorage.getItem("district") : "");
    this.user.province = (sessionStorage.getItem("province") != "" ? sessionStorage.getItem("province") : "");
    this.user.image = (sessionStorage.getItem("image") != "" ? sessionStorage.getItem("image") : "./assets/img/faces/user_profile_default.jpg");
  }

}
