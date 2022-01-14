import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Message } from 'app/models/message.model';
import { User, UserCredential, UserTemp } from 'app/models/user.model';
import { LCCMainDetails, LCCWeekDetails } from 'app/models/lcc.model';
import { LccService } from 'app/services/lcc.service';
import { DialogService } from 'app/services/dialog.service';
import { DatePipe } from '@angular/common';
import { UserFarmersService } from 'app/services/user-farmers.service';
import { Field } from 'app/models/field.model';
import { FieldService } from 'app/services/field.service';

@Component({
  selector: 'app-user-reports-farmers',
  templateUrl: './user-reports-farmers.component.html',
  styleUrls: ['./user-reports-farmers.component.css']
})
export class UserReportsFarmersComponent implements OnInit {

  documentName = "Sample Name";
  date : string;
  province = "Sample Province";
  district = "Sample District";
  division = "Sample Division";

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort : MatSort;
  reportType = "Farmers Report";
  user : User  = {
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

  userTemp : UserTemp  = {
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
    time : '',
    status : '',  
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

  users : User [];

  changedWeekDetails: LCCWeekDetails[];
  lccMainDetails : LCCMainDetails;
  havePreviousRecords : boolean = false;
  approved = 0;
  declined = 0;
  pending = 0;
  all = 0;
  fields : Field [];
  passedUser : User;
  length = false;

  displayedColumns: string[] = ['firstName', 'lastName', 'address', 'phone', 'nic' ];
  dataSource : MatTableDataSource<User>;

  constructor(private datepipe : DatePipe, private userFarmersService : UserFarmersService, private fieldService : FieldService) { 
    this.date  = this.datepipe.transform((new Date), 'MMM d, y').toString();
    this.documentName = "Farmers Report";
  }

  ngOnInit(): void {
    this.loadSessionDetails();
    this.getFarmerDetailsWithFieldsNew();
  }

  //get farmer details
  getFarmerDetailsWithFieldsNew(){
    var fieldsWithFarmer = [];
    var field = [];
    var farmers;
    var values;
    var credentials : UserCredential = {
      userID : '',
      email : '',
      password : ''
    }
    this.userFarmersService.getAllFarmers().subscribe(data =>{
      // this.length = (data.length > 0 ? true : false);
      farmers = data.map(e =>{
        return {
          id : e.payload.doc.id,
          ...e.payload.doc.data() as {}
        } as UserTemp;
      })
      farmers.forEach(element => {
        credentials.userID = element.id;
        console.log("the id is here : " + element.id);
        this.fieldService.getFieldsByFarmerId(credentials).subscribe(data =>{
          // console.log(data.length);
          field = data.map(e =>{
            // console.log(e.payload.doc.data())
            return {
              // id : e.payload.doc.id, //
              ...e.payload.doc.data() as {}
            } as Field
          })
          // console.log("number records : " + field.length)
          for(var i = 0; i < field.length; i++){
            this.all ++;
            if(field[i].division == this.user.division){
              this.length = true;
              fieldsWithFarmer.push({
                details : field[i].id,
                address : field[i].address,
                registrationNumber : field[i].registrationNumber,
                firstName : element.firstName,
                lastName : element.lastName,
                phone : element.phone,
                email : element.email,
                nic : element.nic,
                fullName : element.firstName + " " + element.lastName
              });
            }
          }
          // console.log(fieldsWithFarmer)
          this.dataSource = new MatTableDataSource(fieldsWithFarmer);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        })
      });
    })
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
    this.division = this.user.division;
    this.district = this.user.district;
    this.province = this.user.province;
  }
}