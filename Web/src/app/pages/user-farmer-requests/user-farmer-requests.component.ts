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
import { debounceTime } from 'rxjs-compat/operator/debounceTime';
import { AngularFirestore } from '@angular/fire/firestore';

const NO_OF_WEEKS = 8;

@Component({
  selector: 'app-user-farmer-requests',
  templateUrl: './user-farmer-requests.component.html',
  styleUrls: ['./user-farmer-requests.component.css']
})
export class UserFarmerRequestsComponent implements OnInit {

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
  actionButtonClicked : boolean = false;
  onlyRowClicked : boolean = false;
  all : number = 0;
  pendingRequests : number = 0;
  declinedRequests : number = 0;
  confirmedRequests : number = 0;
  testingFields = [];
  loading = true;

  displayedColumns: string[] = ['registrationNumber', 'address', 'farmerName', 'createdDate', 'requestNote', 'status', 'action'];
  dataSource : MatTableDataSource<LCCWeekDetails>;

  constructor(private fireStore : AngularFirestore, private lccService : LccService, private dialog : DialogService, private userService : UserService, private fieldService : FieldService, private fieldVisitService : FieldVisitService, private router : Router) { }

  ngOnInit(): void {
    this.loadSessionDetails();
    this.getVisitDetailsWithFieldsTesting();

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
    this.pendingRequests = 0;
    this.confirmedRequests = 0;
    this.declinedRequests = 0;
    var i = 0;
    var releventFields;
    this.fieldVisitService.getFieldVisitsByDivision(this.user)
    .subscribe(data => {
      fieldVisits = data.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data() as {}
        } as FieldVisitTemp;
      })
      fieldVisits.forEach(f => {
      
        if(f.status == "pending" || f.status == "confirmed" || f.status == "declined"){
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
              relevantFields.push(f);
              // console.log(fieldVisits)
              this.dataSource = new MatTableDataSource(relevantFields);
              this.dataSource.paginator = this.paginator;
              this.dataSource.sort = this.sort;
            });
  
          });
        }else{
          // console.log(f);
        }
      })
    
    });
  }

  getVisitDetailsWithFieldsTesting(){
    var fieldVisits;
    var relevantFields = [];
    var field;
    var farmer;
    this.pendingRequests = 0;
    this.confirmedRequests = 0;
    this.declinedRequests = 0;
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
          if(status == "pending" || status == "declined" || status == "confirmed"){
            if(status == "pending"){ this.pendingRequests++; }
            else if(status == "confirmed"){ this.confirmedRequests++; }
            else{ this.declinedRequests++ ;}
            this.all = this.pendingRequests + this.declinedRequests + this.confirmedRequests;
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
        
        })
        this.loading = false;
      }
    )
  }

  onViewVisitsClick(row){
    if(this.actionButtonClicked == false){
      console.log(row);
      this.dialog.openDetailsDialog(row,"visitDetails").afterClosed();
    }
  }

  onEditClick(value){
    this.actionButtonClicked = true;
    console.log("This is the row returned by the button click event " + value.id);
    this.dialog.openEditDialog({requestId : value.id, 
      status : value.status, 
      address : value.address, 
      registrationNumber : value.registrationNumber, 
      plantAge : value.plantAge, 
      visitDate : value.visitDate, 
      note : value.note,
      requestNote : value.requestNote,
      createdDate : value.createdDate},
      "addDetails").subscribe(data =>{
      this.actionButtonClicked = !data;
    })
    
    this.loadSessionDetails();
  }
}