import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Message } from 'app/models/message.model';
import { User, UserCredential } from 'app/models/user.model';
import { LCCMainDetails, LCCWeekDetails } from 'app/models/lcc.model';
import { DialogService } from 'app/services/dialog.service';
import { Router } from '@angular/router';
import { Field } from 'app/models/field.model';
import { FieldService } from 'app/services/field.service';
import { UserService } from 'app/services/user.service';
import { sample } from 'rxjs-compat/operator/sample';

const NO_OF_WEEKS = 8;

@Component({
  selector: 'app-user-feilds',
  templateUrl: './user-feilds.component.html',
  styleUrls: ['./user-feilds.component.css']
})
export class UserFeildsComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort : MatSort;

  user : User = {
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
    registeredDate : '',
    createdDate: '',
    createdTimestamp: 0,
    modifiedDate: '',
    modifiedTimestamp : 0,
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

  changedWeekDetails: LCCWeekDetails[];
  lccMainDetails : LCCMainDetails;
  havePreviousRecords : boolean = false;
  farmer: User;
  fields : Field[];
  displayedColumns: string[] = ['registrationNumber', 'address', 'fullName', 'phone'];
  dataSource : MatTableDataSource<Field>;
  approved = 0;
  declined = 0;
  pending = 0;
  all = 0;

  constructor(private fieldService : FieldService, private dialog : DialogService, private router : Router, private userService : UserService) { }

  ngOnInit(): void {
    this.loadSessionDetails();
    // this.getFieldsDetails();
    this.getFieldsDetailsWithFarmerNew();
    // this.getFieldsDetailsWithFarmer();
    // this.dataSource = new MatTableDataSource(this.changedWeekDetails);
    // setTimeout(() => this.dataSource.paginator = this.paginator);
    // setTimeout(() => this.dataSource.sort = this.sort);
    // this.dataSource.sort = this.sort;
    // this.dataSource.paginator = this.paginator;
  }

  applyFilter(filterValue : string){
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onChange(row){
    var weekNo = row.week;
    var rowDetails = row;
    this.changedWeekDetails[weekNo - 1] = rowDetails;
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

  updateWeekDetails(){
    for(var i = 0; i < NO_OF_WEEKS; i++ ){
      var j = i;
      if(this.changedWeekDetails[i] == undefined){
        this.changedWeekDetails[i] = {week: j+1, levelOne: 0, levelTwo: 0, levelThree: 0}
      }else{
        if(this.changedWeekDetails[i].levelOne == 0){
          this.changedWeekDetails[i].levelOne = 0;
        }if(this.changedWeekDetails[i].levelTwo == 0){
          this.changedWeekDetails[i].levelTwo = 0;
        }if(this.changedWeekDetails[i].levelThree == 0){
          this.changedWeekDetails[i].levelThree = 0;
        }
      } 
    }
  }

  getFieldsDetails(){
    this.user.division = sessionStorage.getItem('division');
    this.fieldService.getFieldsByDivision(this.user).subscribe(
      data => {
        this.fields = data.map(e => {
          return {
            // id: e.payload.doc.id,
            ...e.payload.doc.data() as {}
          } as Field;
        })
        this.dataSource = new MatTableDataSource(this.fields);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        // this.getCounts();
      }
    )
  }

  getFieldsDetailsWithFarmer(){
    var fieldWithFarmer = [];
    this.fieldService.getFieldsByDivision(this.user).subscribe(data => {
      // console.log("this is the lenght of the divisions : " + data.length);
      this.fields = data.map(e => {
        return {
          // id: e.payload.doc.id,
          ...e.payload.doc.data() as {}
        } as Field;
      })
      // console.log(this.fields.length);
      // console.log(this.fields[1])
      this.fields.forEach(f => {
        this.userService.getUser(f.farmerId).subscribe(data => {
          this.farmer = data.payload.data() as User;
          f.farmer = this.farmer.firstName + " " + this.farmer.lastName;
          fieldWithFarmer.push({
            address : f.address, 
            registrationNumber : f.registrationNumber,
            firstName : this.farmer.firstName,
            lastName : this.farmer.lastName,
            phone : this.farmer.phone,
            email : this.farmer.email,
            fullName : this.farmer.firstName + " " + this.farmer.lastName
          });
          this.dataSource = new MatTableDataSource(fieldWithFarmer);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        });
      })
      // console.log(fieldWithFarmer)
    });
  }

  getFieldsDetailsWithFarmerNew(){
    var fieldWithFarmer = [];
    this.fieldService.getFieldsByDivision(this.user).subscribe(data => {
      // console.log("this is the lenght of the divisions : " + data.length);
      this.fields = data.map(e => {
        return {
          // id: e.payload.doc.id,
          ...e.payload.doc.data() as {}
        } as Field;
      })
      // console.log(this.fields.length);
      // console.log(this.fields[1])
      this.fields.forEach(f => {
        this.userService.getUser(f.farmerId).subscribe(data => {
          this.farmer = data.payload.data() as User;
          f.farmer = this.farmer.firstName + " " + this.farmer.lastName;
          fieldWithFarmer.push({
            address : f.address, 
            registrationNumber : f.registrationNumber,
            firstName : this.farmer.firstName,
            lastName : this.farmer.lastName,
            phone : this.farmer.phone,
            email : this.farmer.email,
            fullName : this.farmer.firstName + " " + this.farmer.lastName
          });
          this.dataSource = new MatTableDataSource(fieldWithFarmer);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        });
      })
      // console.log(fieldWithFarmer)
    });
  }

  // getCounts() {
  //   this.fields.forEach(data => {
  //     if (data.status == 'pending') {
  //       this.pending++;
  //     }else if (data.status == 'declined') {
  //       this.declined++;
  //     } else {
  //       this.approved++;
  //     }
  //   });
  //   this.all = this.declined + this.pending + this.approved;
  // }

  onClick(row){
    // console.log(this.message);
    console.log(row);
    this.dialog.openDetailsDialog(row,"fieldDetails").afterClosed();
  }

}