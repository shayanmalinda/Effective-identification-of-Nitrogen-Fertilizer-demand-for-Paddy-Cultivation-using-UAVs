import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Message } from 'app/models/message.model';
import { User, UserCredential } from 'app/models/user.model';
import { LCCMainDetails, LCCWeekDetails } from 'app/models/lcc.model';
import { LccService } from 'app/services/lcc.service';
import { DialogService } from 'app/services/dialog.service';
import { DatePipe } from '@angular/common';
import { Field, FieldTemp } from 'app/models/field.model';
import { FieldService } from 'app/services/field.service';
import { UserService } from 'app/services/user.service';

@Component({
  selector: 'app-user-reports-fields',
  templateUrl: './user-reports-fields.component.html',
  styleUrls: ['./user-reports-fields.component.css']
})
export class UserReportsFieldsComponent implements OnInit {

  documentName = "Sample Name";
  date : string;
  province = "Sample Province";
  district = "Sample District";
  division = "Sample Division";

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort : MatSort;
  reportType = "Fields Report";
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
  fieldsTemp : FieldTemp[];
  displayedColumns: string[] = ['registrationNumber', 'address', 'fullName', 'phone'];
  dataSource : MatTableDataSource<Field>;
  approved = 0;
  declined = 0;
  pending = 0;
  all = 0;

  constructor(private datepipe : DatePipe, private fieldService : FieldService, private userService : UserService) { 
    this.date  = this.datepipe.transform((new Date), 'MMM d, y').toString();
    this.documentName = "Fields Report";
  }

  ngOnInit(): void {
    this.loadSessionDetails();
    this.getFieldsDetailsWithFarmerNew();
  }

  //to get the field details
  getFieldsDetailsWithFarmerNew(){
    var fieldWithFarmer = [];
    this.fieldService.getFieldsByDivision(this.user).subscribe(data => {
      // console.log("this is the lenght of the divisions : " + data.length);
      this.fieldsTemp = data.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data() as {}
        } as FieldTemp;
      })
      // console.log(this.fields.length);
      // console.log(this.fields[1])
      this.fieldsTemp.forEach(f => {
        this.all ++;
        this.userService.getUser(f.farmerId).subscribe(data => {
          this.farmer = data.payload.data() as User;
          // f.farmer = this.farmer.firstName + " " + this.farmer.lastName; @heshan
          fieldWithFarmer.push({
            fieldId : f.id,
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
    this.province = this.user.province;
    this.district = this.user.district;
    this.division = this.user.division;
  }
}

