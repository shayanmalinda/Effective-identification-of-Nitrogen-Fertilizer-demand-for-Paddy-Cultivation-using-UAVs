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
import { FieldVisitService } from 'app/services/field-visit.service';
import { FieldVisitTemp } from 'app/models/field-visit.model';
import { FieldService } from 'app/services/field.service';
import { Field } from 'app/models/field.model';
import { UserService } from 'app/services/user.service';

@Component({
  selector: 'app-user-reports-requests',
  templateUrl: './user-reports-requests.component.html',
  styleUrls: ['./user-reports-requests.component.css']
})
export class UserReportsRequestsComponent implements OnInit {

  documentName = "Sample Name";
  date : string;
  province = "Sample Province";
  district = "Sample District";
  division = "Sample Division";

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort : MatSort;
  reportType = "Requests Report";
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
  actionButtonClicked : boolean = false;
  onlyRowClicked : boolean = false;
  all : number = 0;
  pendingRequests : number = 0;
  declinedRequests : number = 0;
  confirmedRequests : number = 0;
  length = false;

  displayedColumns: string[] = ['registrationNumber', 'address', 'farmerName', 'createdDate', 'status'];
  dataSource : MatTableDataSource<LCCWeekDetails>;


  constructor(private datepipe : DatePipe, private fieldVisitService : FieldVisitService, private fieldService : FieldService, private userService : UserService) { 
    this.date  = this.datepipe.transform((new Date), 'MMM d, y').toString();
    this.documentName = "Requests Report";
  }

  ngOnInit(): void {
    this.loadSessionDetails();
    this.getVisitDetailsWithFields();
  }

  //to load user details
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
    this.province = this.user.province;
    this.district = this.user.district;
  }

  //to get visit details
  getVisitDetailsWithFields(){
    var fieldVisits;
    var relevantFields = [];
    var fieldVisit;
    var requestPending;
    var visitPending;
    var processing;
    var completed;
    var field;
    var farmer;
    this.pendingRequests = 0;
    this.confirmedRequests = 0;
    this.declinedRequests = 0;
    this.fieldVisitService.getFieldVisitsByDivision(this.user)
    .subscribe(data => {
      fieldVisits = data.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data() as {}
        } as FieldVisitTemp;
      })

      fieldVisits.forEach(f => {
        // if (f.status == 'request pending') requestPending += 1;
        // else if (f.status == 'visit pending') visitPending += 1;
        // else if (f.status == 'processing') processing += 1;
        // else if (f.status == 'completed') completed += 1;
        // console.log("in here");
        if(f.status == "pending" || f.status == "confirmed" || f.status == "declined"){
          this.length = true;
          if(f.status == "pending"){ this.pendingRequests++; }
          else if(f.status == "confirmed"){ this.confirmedRequests++; }
          else{ this.declinedRequests++ ;}
          this.all = this.pendingRequests + this.declinedRequests + this.confirmedRequests;
          this.fieldService.getField(f.fieldId).subscribe(data => {
            field = data.payload.data() as Field;
            f.field = field;
            f.address = field.address;
            f.registrationNumber = field.registrationNumber;
            this.userService.getUser(field.farmerId).subscribe(data => {
              farmer = data.payload.data() as User;
              f.farmer = farmer;
              f.farmerName = farmer.firstName + " " + farmer.lastName;
              // console.log(fieldVisits)
              this.dataSource = new MatTableDataSource(fieldVisits);
              this.dataSource.paginator = this.paginator;
              this.dataSource.sort = this.sort;
            });
  
            // this.dataSource = new MatTableDataSource(this.fieldVisits);
            // this.dataSource.paginator = this.paginator;
            // this.dataSource.sort = this.sort;
  
          });
        }

      })

    });
  }
}

