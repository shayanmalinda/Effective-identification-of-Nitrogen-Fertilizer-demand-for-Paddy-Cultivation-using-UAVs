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
import { Router } from '@angular/router';
import { FieldService } from 'app/services/field.service';
import { FieldVisitService } from 'app/services/field-visit.service';
import { FieldVisit, FieldVisitTemp } from 'app/models/field-visit.model';
import { Field } from 'app/models/field.model';
import { UserService } from 'app/services/user.service';
import { PathLocationStrategy } from '@angular/common';
import { isConstructorDeclaration } from 'typescript';

const NO_OF_WEEKS = 8;
@Component({
  selector: 'app-user-field-history',
  templateUrl: './user-field-history.component.html',
  styleUrls: ['./user-field-history.component.css']
})
export class UserFieldHistoryComponent implements OnInit {

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

  fieldvisitTemp : FieldVisitTemp = {
    id : '',
    date: '',
    division: '',
    fieldId: '',
    field: '',
    latitude: '',
    longitude: '',
    requestNote: '',
    status: '',
    address: '',
    farmer: '',
    farmerName: '',
    farmerTel: '',
    registrationNo: '',
    modifiedDate: '',
    modifiedTimestamp: 0,
    note : '',
    visitDate : '',
  }

  changedWeekDetails: LCCWeekDetails[];
  lccMainDetails : LCCMainDetails;
  havePreviousRecords : boolean = false;
  actionButtonClicked : boolean = false;
  confirmedRequests : number = 0;
  processingRequests : number = 0;
  all : number  = 0;
  fieldId : string;

  // displayedColumns: string[] = ['registrationNumber', 'address', 'farmerName', 'date', 'division', 'requestNote', 'status'];
  displayedColumns: string[] = ['requestNote','plantAge', 'modifiedDate', 'note', 'status', 'visitDate'];
  dataSource : MatTableDataSource<LCCWeekDetails>;

  constructor(private lccService : LccService, private dialog : DialogService, private userService : UserService, private fieldService : FieldService, private fieldVisitService : FieldVisitService, private router : Router) { 
    this.fieldvisitTemp.fieldId = this.router.getCurrentNavigation().extras.state.fieldId;
    console.log("this is the field id : " + this.fieldvisitTemp.fieldId)
  }

  ngOnInit(): void {
    // this.fieldId = this.router.getCurrentNavigation().extras.state.fieldId;
    // this.fieldId = sessionStorage.getItem('fieldId');
    this.loadSessionDetails();
    this.getVisitDetailsWithFields();
    // this.getLCCDetails();
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

  onSaveClick(){
    console.log("in the onsave" + this.changedWeekDetails);
    console.log(sessionStorage.getItem('userID'));
    this.lccMainDetails = {
      userID : '',
      division : '',
      weekDetails : this.changedWeekDetails
    };
    this.lccMainDetails.userID = sessionStorage.getItem('userID');
    this.lccMainDetails.division = sessionStorage.getItem('division');
    this.updateWeekDetails();
    this.lccMainDetails.weekDetails = this.changedWeekDetails;
    this.lccService.saveLccDetails(this.lccMainDetails, this.havePreviousRecords)
          .then(res =>{
              this.message.title = "success";
              this.message.showMessage = "You have successfully update the LCC details !";
              this.dialog.openConfirmDialog(this.message).afterClosed().subscribe(res =>{
              this.router.navigate(['/profile']);
              });
            }, err => {
              this.message.title = "error";
              this.message.showMessage = err;
              this.dialog.openConfirmDialog(this.message).afterClosed().subscribe(res =>{
            });
          }
        )
  }

  onCancelClick(){
    this.message.title = "warning";
    this.message.showMessage = "The changes you have done not be applied to the LCC details !";
    this.dialog.openConfirmDialog(this.message).afterClosed().subscribe(res =>{
      this.router.navigate(['/profile']);
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
  }

  updateWeekDetails(){
    for(var i = 0; i < NO_OF_WEEKS; i++ ){
      var j = i;
      if(this.changedWeekDetails[i] == undefined){
        this.changedWeekDetails[i] = {week: j+1, levelFour: 0, levelTwo: 0, levelThree: 0}
      }else{
        if(this.changedWeekDetails[i].levelFour == 0){
          this.changedWeekDetails[i].levelFour = 0;
        }if(this.changedWeekDetails[i].levelTwo == 0){
          this.changedWeekDetails[i].levelTwo = 0;
        }if(this.changedWeekDetails[i].levelThree == 0){
          this.changedWeekDetails[i].levelThree = 0;
        }
      } 
    }
  }

  getLCCDetails(){
    this.user.division = sessionStorage.getItem('division');
    this.lccService.getLccDetailsByDivision(this.user).subscribe(
      data => {
        if(data.docs.length > 0){
          this.havePreviousRecords = true;
          this.lccMainDetails = data.docs[0].data() as LCCMainDetails;
          this.changedWeekDetails = this.lccMainDetails.weekDetails;
          sessionStorage.setItem('LCCID', data.docs[0].id);
          console.log(this.changedWeekDetails);
          this.dataSource = new MatTableDataSource(this.changedWeekDetails);
          setTimeout(() => this.dataSource.paginator = this.paginator);
          setTimeout(() => this.dataSource.sort = this.sort);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
        }else{
          this.changedWeekDetails = [
            {week: 1, levelFour: 0, levelTwo: 0, levelThree: 0},
            {week: 2, levelFour: 0, levelTwo: 0, levelThree: 0},
            {week: 3, levelFour: 0, levelTwo: 0, levelThree: 0},
            {week: 4, levelFour: 0, levelTwo: 0, levelThree: 0},
            {week: 5, levelFour: 0, levelTwo: 0, levelThree: 0},
            {week: 6, levelFour: 0, levelTwo: 0, levelThree: 0},
            {week: 7, levelFour: 0, levelTwo: 0, levelThree: 0},
            {week: 8, levelFour: 0, levelTwo: 0, levelThree: 0}
          ];
          this.dataSource = new MatTableDataSource(this.changedWeekDetails);
          setTimeout(() => this.dataSource.paginator = this.paginator);
          setTimeout(() => this.dataSource.sort = this.sort);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
        }
      }
    )
  }

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
    this.confirmedRequests = 0;
    //should be udpated
    // console.log(this.fieldvisitTemp.fieldId);
    this.fieldVisitService.getFieldVisitsByFieldID(this.fieldvisitTemp).subscribe(data => {
      // console.log("fieldvisit details in user field : " + fieldVisits);
      this.all = data.length;
      fieldVisits = data.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data() as {}
        } as FieldVisitTemp;
      })
      console.log(fieldVisits)
      this.dataSource = new MatTableDataSource(fieldVisits);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  onViewVisitsClick(row){
    if(this.actionButtonClicked == false){
      console.log(row);
      // this.message.showMessage = "You have entered invalid password !";
      // this.message.title = 'success';
      // console.log(this.message);
      this.dialog.openDetailsDialog(row,"visitDetails").afterClosed();
    }
  }

  onEditClick(value){
    this.actionButtonClicked = true;
    // console.log("This is the row returned by the button click event " + value.status);
    console.log(value)
    this.dialog.openEditDialog({
        requestId : value.id, 
        status : value.status, 
        address : value.address, 
        registrationNumber : value.registrationNumber, 
        plantAge : value.plantAge, visitDate : 
        value.visitDate, note : value.note}, 
        "changeDetails")
      .subscribe(data =>{
      this.actionButtonClicked = !data;
    })
  }

}