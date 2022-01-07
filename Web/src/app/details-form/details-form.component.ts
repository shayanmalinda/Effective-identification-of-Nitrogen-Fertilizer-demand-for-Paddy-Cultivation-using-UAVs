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
  };
  user : User;
  title: string = 'AGM project';
  latitude!: number;
  longitude!: number;
  zoom: number;
  repeat : string = "default";
  acceptForm : boolean = true;
  height = 420;
  selectedDate : string = "";
  noteInput : string = "";
  dateSelected : boolean = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: {type : string, details }, private datepipe : DatePipe, private fieldVisitService : FieldVisitService, private datePipe : DatePipe, private router: Router, private matDialogRef : MatDialogRef<DetailsFormComponent>, private dialog : DialogService, private userService : UserService, private mapsAPILoader: MapsAPILoader, private ngZone: NgZone, private userFarmersService : UserFarmersService) { 
    
    this.latitude = 6.9271;
    this.longitude = 79.8612;
    this.zoom = 25;
    
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
      this.formTitle = "Field Visits Details";
      // console.log(data.details.requestId);
      this.fieldVisitTemp.id = data.details.requestId;
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
      this.acceptForm = true;
      this.btnStyleOne = "btn btn-success btn-round margin-left : 500px";
    }else{
      this.acceptForm = false;
      this.btnStyleOne = "btn btn-danger btn-round margin-left : 500px";
    }
  }

  onConfirmButtonClick(){
    let currentTime = new Date();
    if(this.selectedDate == ""){
      this.message.title = "Error";
      this.message.showMessage = "You have to select a suitable date to confirm the field visit !!";
    }else{
      // console.log(this.noteInput);
      // console.log(this.dateSelected);
      // console.log("hello  " + this.fieldVisitTemp.id);
      this.fieldVisitTemp.status = "confirmed";
      this.fieldVisitTemp.note = this.noteInput;
      this.fieldVisitTemp.modifiedDate = this.datepipe.transform((new Date), 'MMM d, y h:mm:ss a').toString();
      this.fieldVisitTemp.modifiedTimestamp = currentTime.getTime();
      this.fieldVisitService.updateFieldVisitStatus(this.fieldVisitTemp);
      this.message.title = "success";
      this.message.showMessage = "You have successfully confirmed the field visit !!";
      this.router.navigate(['/user-farmer-requests']);
    }
    this.dialog.openConfirmDialog(this.message).afterClosed().subscribe(res => {
    this.clearFields();
    })
  }

  onDeclineButtonClick(){
    let currentTime = new Date();
    this.fieldVisitTemp.status = "declined";
    this.fieldVisitTemp.note = this.noteInput;
    this.fieldVisitTemp.modifiedDate = this.datepipe.transform((new Date), 'MMM d, y h:mm:ss a').toString();
    this.fieldVisitTemp.modifiedTimestamp = currentTime.getTime();
    this.fieldVisitService.updateFieldVisitStatus(this.fieldVisitTemp);
    this.message.title = "success";
    this.message.showMessage = "You have declined the field request !!";
    this.dialog.openConfirmDialog(this.message).afterClosed().subscribe(res => {
      this.clearFields();
    })
    this.router.navigate(['/user-farmer-requests']);
  }

  clearFields(){
    this.selectedDate = "";
    this.noteInput = "";
  }
  
}

