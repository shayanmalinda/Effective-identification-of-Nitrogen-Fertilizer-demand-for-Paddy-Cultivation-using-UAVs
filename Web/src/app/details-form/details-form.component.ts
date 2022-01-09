import { Component, OnInit, Inject, ViewChild, ElementRef, NgZone } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { Message } from 'app/models/message.model';
import { User, UserCredential } from 'app/models/user.model';
import { DialogService } from 'app/services/dialog.service';
import { UserService } from 'app/services/user.service';
import { MapsAPILoader } from '@agm/core';
import { UserFarmersService } from 'app/services/user-farmers.service'; 
import { ThrowStmt } from '@angular/compiler';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { FieldVisit, FieldVisitTemp } from 'app/models/field-visit.model';
import { FieldVisitService } from 'app/services/field-visit.service';

@Component({
  selector: 'app-details-form',
  templateUrl: './details-form.component.html',
  styleUrls: ['./details-form.component.css']
})
export class DetailsFormComponent implements OnInit {

  btnStyleOne : string  = "";
  btnStyleTwo : string  = "";
  btnTextOne : string  = "";
  isVisible : boolean = true;
  formTitle : string;
  userCredential : UserCredential = {
    userID : "",
    email : "",
    password : ""
  };
  //should be replaced by the this.user after the completion of the system.
  testing  = {
    email : "",
    division : "",
    status : "",
  }
  message : Message = {
    title : '',
    showMessage : '',
  };
  fieldVisitTemp : FieldVisitTemp = {
    id: '',
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
    visitDate : ''
  };
  user : User;
  title: string = 'AGM project';
  latitude!: number;
  longitude!: number;
  zoom: number;
  repeat : string = "default";
  acceptForm : number = 0;
  processingForm : boolean = false;
  height = 420;
  selectedDate = {
    year : 0,
    month : 0,
    day : 0
  };
  noteInput : string = "";
  dateSelected : boolean = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: {type : string, details }, private datepipe : DatePipe, private fieldVisitService : FieldVisitService, private datePipe : DatePipe, private router: Router, private matDialogRef : MatDialogRef<DetailsFormComponent>, private dialog : DialogService, private userService : UserService, private mapsAPILoader: MapsAPILoader, private ngZone: NgZone, private userFarmersService : UserFarmersService) { 
    
    this.latitude = 6.9271;
    this.longitude = 79.8612;
    this.zoom = 25;
    this.data = data;
    console.log("Thi i s : " + this.data)
    
    if(data.type == "farmerDetails"){
      this.formTitle = "Farmer Details"
    }
    if(data.type == "fieldDetails"){
      this.formTitle = "Field Details"
      console.log(data.details)
      this.userCredential.userID = data.details.farmerId;
      console.log("this is the farmer ID needed in field:" + data.details.farmerId);
    }
    if(data.type == "farmers"){
      this.formTitle = "Farmers"
    }
    if(data.type == "visitDetails"){
      this.formTitle = "Field Visits Details";
      console.log("the farmer id is : " + data.details.field.farmerId);
      this.data.details.createdDate = datePipe.transform(data.details.createdDate, 'MMMM d, y');
      this.userCredential.userID = data.details.field.farmerId;
      this.latitude = parseFloat(data.details.latitude);
      this.longitude = parseFloat(data.details.longitude);
    }
    if(data.type == "addDetails"){
      console.log("comes to add details section ");
      this.formTitle = "Farmer Request Details";
      // console.log(data.details);
      this.acceptForm = (data.details.status == "pending" ? 0 : (data.details.status == "decline" ? 1 : 2));
      this.fieldVisitTemp.id = data.details.requestId;
      this.fieldVisitTemp.note = data.details.note;
      this.fieldVisitTemp.visitDate = data.details.visitDate;
    }
    if(data.type == "changeDetails"){
      this.formTitle = "Field Visit Details";
      // console.log(data.details);
      this.processingForm = (data.details.status == "confirmed" ? true : false);
      // console.log(" type : " + data.type + " status : " + this.processingForm);
      this.fieldVisitTemp.id = data.details.requestId;
      this.fieldVisitTemp.note = data.details.note;
      this.fieldVisitTemp.visitDate = data.details.visitDate;
    }
    this.btnStyleOne = "btn btn-success btn-round margin-left : 500px";
    this.btnStyleTwo = "btn btn-default btn-round margin-left : 500px";
    this.btnTextOne = "ok";
  }

  ngOnInit(): void {
  }

  onViewFarmerClick(){
    this.repeat = "set";
    // console.log("comes here : ")
    this.userFarmersService.getFarmerById(this.userCredential).subscribe(data => {
      if(this.repeat == "set"){
        // console.log("comes here too")
        this.repeat = "unset";
        this.user = data.payload.data() as User;
        // this.testing.userRole = this.user.userRole
        // this.testing.nic = this.user.nic
        // this.testing.email = this.user.email
        // this.testing.status = this.user.userRole;
        // this.testing.division = this.user.firstName;
        // // this.testing.email = this.user.email;
        // console.log(this.user);
        // this.testing.status = sessionStorage.getItem("status");
        // this.testing.division = sessionStorage.getItem("division");
        // this.testing.email = sessionStorage.getItem("email");
        // console.log(this.testing.division);
        this.dialog.openDetailsDialog(this.user, "farmerDetails").afterClosed();
      }
    })
  }

  onMapClicked(event : any){
    console.table(event.coords);
    this.latitude = 6.927079;
    this.longitude = 79.861244;
  }

  onAfterConfirmedClick(){
    console.log("comes here : ");
    // this.userFieldVisitComponent.actionButtonClicked = false;
  }

  buttonChange(value){
    console.log(value.target.value);
    var returnedValue = value.target.value;
    this.btnStyleTwo = "btn btn-default btn-round";
    if(returnedValue == 1){
      this.acceptForm = 0;
      this.btnStyleOne = "btn btn-success btn-round margin-left : 500px";
    }else{
      this.acceptForm = 1;
      this.btnStyleOne = "btn btn-danger btn-round margin-left : 500px";
    }
  }

  onConfirmButtonClick(){
    let currentTime = new Date();
    if(this.selectedDate.year == 0){
      this.message.title = "Error";
      this.message.showMessage = "You have to select a suitable date to confirm the field visit !!";
      this.dialog.openConfirmDialog(this.message).afterClosed().subscribe(res => {
        // this.clearFields();
      })
    }else{
      // console.log(this.noteInput);
      console.log(this.selectedDate);
      // console.log("hello  " + this.fieldVisitTemp);
      this.fieldVisitTemp.status = "confirmed";
      this.fieldVisitTemp.visitDate = "" + this.selectedDate.year + "-" + this.selectedDate.month + "-" + this.selectedDate.day + "";
      this.fieldVisitTemp.note = this.noteInput;
      this.fieldVisitTemp.modifiedDate = this.datepipe.transform((new Date), 'MMM d, y h:mm:ss a').toString();
      this.fieldVisitTemp.modifiedTimestamp = currentTime.getTime();
      // console.log(this.fieldVisitTemp);
      this.fieldVisitService.updateFieldVisitStatus(this.fieldVisitTemp)
      .then(res => {
        this.message.title = "success";
        this.message.showMessage = "You have successfully confirmed the visit on : " + this.fieldVisitTemp.visitDate + " !!";
        this.dialog.openConfirmDialog(this.message).afterClosed().subscribe(res => {
          // this.updateSessionDetails();
          // if (this.user.userRole != "admin")
            // this.router.navigate(['/profile']);
            this.router.navigate(['/user-dashboard']);
        });
      }, err => {
        this.message.title = "error";
        this.message.showMessage = err;
        this.dialog.openConfirmDialog(this.message).afterClosed().subscribe(res => {
          this.clearFields();
        })
      });
      
      // console.log(this.fieldVisitTemp)
      // this.fieldVisitService.updateFieldVisitStatus(this.fieldVisitTemp);
      // this.message.title = "success";
      // this.message.showMessage = "You have successfully confirmed the field visit !!";
      // this.dialog.openConfirmDialog(this.message);
      // console.log("completed from here ; ");
      // this.router.navigate(['/user-field-visits']);
      // this.dialog.openConfirmDialog(this.message).afterClosed().subscribe(res => {
      //   // this.clearFields();
      //   // this.router.navigate(['/user-field-visits']);
      // })
      // console.log("comes to the detalis forms");
      
      // this.fieldVisitService.updateFieldVisitStatus(this.fieldVisitTemp)
      // .then(res => {
      //   this.message.title = "success";
      //   this.message.showMessage = "You have successfully confirmed the farmer request !";
      //   this.dialog.openConfirmDialog(this.message).afterClosed().subscribe(res => {
      //     console.log("finally")
      //   });
      // }, err => {
      //   this.message.title = "error";
      //   this.message.showMessage = err;
      //   this.dialog.openConfirmDialog(this.message).afterClosed().subscribe(res => {
      //     this.clearFields();
      //   })
      // });
    }
    // this.router.navigate(['/user-farmer-requests']);
  }

  onDeclineButtonClick(){
    let currentTime = new Date();
    // this.fieldVisitTemp.note = data.details.;
    this.fieldVisitTemp.status = "declined";
    this.fieldVisitTemp.modifiedDate = this.datepipe.transform((new Date), 'MMM d, y h:mm:ss a').toString();
    this.fieldVisitTemp.modifiedTimestamp = currentTime.getTime();
    this.fieldVisitTemp.note = this.noteInput;
    this.fieldVisitService.updateFieldVisitStatus(this.fieldVisitTemp)
      .then(res => {
        this.message.title = "success";
        this.message.showMessage = "You have successfully declined the farmer request !!";
        this.dialog.openConfirmDialog(this.message).afterClosed().subscribe(res => {
          // this.updateSessionDetails();
          // if (this.user.userRole != "admin")
            // this.router.navigate(['/profile']);
            this.router.navigate(['/user-dashboard']);
        });
      }, err => {
        this.message.title = "error";
        this.message.showMessage = err;
        this.dialog.openConfirmDialog(this.message).afterClosed().subscribe(res => {
          this.clearFields();
        })
      });
    // this.router.navigate(['/user-field-visits']);
  }

  onCompletedButtonClick(){
    let currentTime = new Date();
    this.fieldVisitTemp.status = "completed";
    this.fieldVisitTemp.modifiedDate = this.datepipe.transform((new Date), 'MMM d, y h:mm:ss a').toString();
    this.fieldVisitTemp.modifiedTimestamp = currentTime.getTime();
    console.log(this.fieldVisitTemp)
    this.fieldVisitService.updateFieldVisitStatus(this.fieldVisitTemp)
    .then(res => {
      this.message.title = "success";
      this.message.showMessage = "You have completed the field visit !!";
      this.dialog.openConfirmDialog(this.message).afterClosed().subscribe(res => {
        // this.updateSessionDetails();
        // if (this.user.userRole != "admin")
          // this.router.navigate(['/profile']);
          this.router.navigate(['/user-dashboard']);
      });
    }, err => {
      this.message.title = "error";
      this.message.showMessage = err;
      this.dialog.openConfirmDialog(this.message).afterClosed().subscribe(res => {
        this.clearFields();
      })
    });
  }

  clearFields(){
    this.selectedDate.year = 0;
    this.noteInput = "";
  }
  
  onProcessingButtonClick(){
    let currentTime = new Date();
    this.fieldVisitTemp.status = "processing";
    // this.fieldVisitTemp.note = this.noteInput;
    this.fieldVisitTemp.modifiedDate = this.datepipe.transform((new Date), 'MMM d, y h:mm:ss a').toString();
    this.fieldVisitTemp.modifiedTimestamp = currentTime.getTime();
    console.log(this.fieldVisitTemp)
    this.fieldVisitService.updateFieldVisitStatus(this.fieldVisitTemp)
    .then(res => {
      this.message.title = "success";
      this.message.showMessage = "You have successfully started the process !!";
      this.dialog.openConfirmDialog(this.message).afterClosed().subscribe(res => {
          this.router.navigate(['/user-dashboard']);
      });
    }, err => {
      this.message.title = "error";
      this.message.showMessage = err;
      this.dialog.openConfirmDialog(this.message).afterClosed().subscribe(res => {
        this.clearFields();
      })
    });
    // this.router.navigate(['/user-farmer-requests']);
  }

  onViewRequestsButtonClick(){
    this.router.navigate(['/user-dashboard']);
  }
}

