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
import { Field } from 'app/models/field.model';
import { FieldVisitTemp } from 'app/models/field-visit.model';
import { FieldVisitService } from 'app/services/field-visit.service';
import { FieldService } from 'app/services/field.service';
import { UserService } from 'app/services/user.service';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-user-reports-visits',
  templateUrl: './user-reports-visits.component.html',
  styleUrls: ['./user-reports-visits.component.css']
})
export class UserReportsVisitsComponent implements OnInit {

  documentName = "Sample Name";
  date : string;
  province = "Sample Province";
  district = "Sample District";
  division = "Sample Division";

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort : MatSort;
  reportType = "Visits Report";
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
  completedRequests : number = 0;
  processingRequests : number = 0;
  all : number  = 0;
  length = false;
  testingFields = [];

  // displayedColumns: string[] = ['registrationNumber', 'address', 'farmerName', 'date', 'division', 'requestNote', 'status'];
  displayedColumns: string[] = ['createdDate', 'registrationNumber', 'farmerName', 'plantAge', 'modifiedDate', 'status'];
  dataSource : MatTableDataSource<LCCWeekDetails>;

  constructor(private fireStore : AngularFirestore, private datepipe : DatePipe, private fieldVisitService : FieldVisitService, private fieldService : FieldService, private userService : UserService) { 
    this.date  = this.datepipe.transform((new Date), 'MMM d, y').toString();
    this.documentName = "Visits Report";
  }

  ngOnInit(): void {
    this.loadSessionDetails();

    //this is the working function
    // this.getVisitDetailsWithFields();
    this.getVisitDetailsWithFieldsTesting();
  }

  //to get field visits details
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
    this.processingRequests = 0;
    this.completedRequests = 0;
    this.fieldVisitService.getFieldVisitsByDivision(this.user).subscribe(data => {
      // console.log("fieldvisit details in user field : " + fieldVisits)
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

        if(f.status == "processing" || f.status == "completed"){
          this.length = true;
          if(f.status == "processing"){ this.processingRequests++; }
          else{ this.completedRequests++ ;}
          this.all = this.completedRequests + this.processingRequests;
          this.fieldService.getField(f.fieldId).subscribe(data => {
            field = data.payload.data() as Field;
            f.field = field;
            f.address = field.address;
            f.registrationNumber = field.registrationNumber;
            this.userService.getUser(field.farmerId).subscribe(data => {
              farmer = data.payload.data() as User;
              f.farmer = farmer;
              f.farmerName = farmer.firstName + " " + farmer.lastName;
              // console.log(f.field);
              relevantFields.push(f);
              // console.log(fieldVisits)
              this.dataSource = new MatTableDataSource(relevantFields);
              // this.dataSource = new MatTableDataSource(this.fieldVisits);
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

  getVisitDetailsWithFieldsTesting(){
    var fieldVisits;
    var relevantFields = [];
    var field;
    var farmer;
    this.completedRequests = 0;
    this.processingRequests = 0;
    console.log(this.user.division);
    var printable = true;
    
    this.fireStore.collection('FieldRequests', ref => ref.where('division', '==', this.user.division)).snapshotChanges().subscribe(
      data => {
          // console.log(data.length);
          var i = 0;
          var fieldVisits = data.map(e => {
            console.log(i);
            
          // console.log(e.payload.doc.get('status'));
          var status = e.payload.doc.get('status');
          var fieldId = e.payload.doc.get('fieldId');
          var details;
          // i++;
          if(status == "completed" || status == "processing"){
            this.length = true;
            if(status == "completed"){ this.completedRequests++; }
            else if(status == "processing"){ this.completedRequests++; }
            this.all = this.completedRequests + this.processingRequests;
            this.fireStore.collection('FieldDetails').doc(fieldId).snapshotChanges().subscribe(
              recievedField => {
                field = recievedField.payload.data() as Field;
                // console.log(field.farmerId)
                this.fireStore.collection('Users').doc(field.farmerId).snapshotChanges().subscribe(
                  recievedFarmer =>{
                    farmer = recievedFarmer.payload.data() as User;
                    this.testingFields.push({
                      farmer : farmer,
                      field : field,
                      address : field.address,
                      registrationNumber : field.registrationNumber,
                      farmerName : farmer.firstName + " " +farmer.lastName,
                      createdDate : e.payload.doc.get('createdDate'),
                      createdTimestamp : e.payload.doc.get('createdTimestamp'),
                      division : e.payload.doc.get('division'),
                      fieldId : e.payload.doc.get('fieldId'),
                      latitude : e.payload.doc.get('latitude'),
                      longitude : e.payload.doc.get('longitude'),
                      modifiedDate : e.payload.doc.get('modifiedDate'),
                      modifiedTimestamp : e.payload.doc.get('modifiedTimestamp'),
                      note : e.payload.doc.get('note'),
                      plantAge : e.payload.doc.get('plantAge'),
                      requestNote : e.payload.doc.get('requestNote'),
                      status : e.payload.doc.get('status'),
                      visitDate : e.payload.doc.get('visitDate'),
                      id : e.payload.doc.id,
                    })
                    i++;
                    console.log(e.payload.doc.id);
                    if(i == data.length){
                      printable = false;
                      console.log(this.testingFields)
                      this.dataSource = new MatTableDataSource(this.testingFields);
                      this.dataSource.paginator = this.paginator;
                      this.dataSource.sort = this.sort;
                    }
                    // console.log(this.testingFields);
                  }
                )
              }
            )
          }else{
            i++;
          }
          // console.log(i);
          // if(i == data.length){
          //   console.log(this.testingFields)
          //   this.dataSource = new MatTableDataSource(this.testingFields);
          //   this.dataSource.paginator = this.paginator;
          //   this.dataSource.sort = this.sort;
          // }
          // i++;
        })
      }
    )
  }
}
