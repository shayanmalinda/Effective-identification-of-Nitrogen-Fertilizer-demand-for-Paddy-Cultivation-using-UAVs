import { Component, OnInit, Inject, ViewChild, ElementRef, NgZone } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { Message } from 'app/models/message.model';
import { User, UserCredential } from 'app/models/user.model';
import { DialogService } from 'app/services/dialog.service';
import { UserService } from 'app/services/user.service';
import { MapsAPILoader } from '@agm/core';
import { UserFarmersService } from 'app/services/user-farmers.service'; 

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
  user : User;
  title: string = 'AGM project';
  latitude!: number;
  longitude!: number;
  zoom: number;
  repeat : string = "default";

  constructor(@Inject(MAT_DIALOG_DATA) public data: {type : string, details }, private matDialogRef : MatDialogRef<DetailsFormComponent>, private dialog : DialogService, private userService : UserService, private mapsAPILoader: MapsAPILoader, private ngZone: NgZone, private userFarmersService : UserFarmersService) { 
    
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
      this.userCredential.userID = data.details.field.farmerId;
      this.latitude = parseFloat(data.details.latitude);
      this.longitude = parseFloat(data.details.longitude);
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
  
}

