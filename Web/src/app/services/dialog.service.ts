import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ShowMessageComponent } from 'app/show-message/show-message.component';
import { Message } from 'app/models/message.model';
import { User } from 'app/models/user.model';
import { DetailsFormComponent } from 'app/details-form/details-form.component';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(private dialog : MatDialog) { }

  openConfirmDialog(message : Message){
    console.log("the message is here :" + message.showMessage);
    return this.dialog.open(ShowMessageComponent, {
      width : '400px',
      disableClose : false,
      panelClass: 'confirm-dialog-container',
      data : message
    });
  }

  openDetailsDialog(passeDetails , detailsType : string){
    console.log("the message is here :" + passeDetails.email);
    return this.dialog.open(DetailsFormComponent, {
      width : '550px',
      disableClose : false,
      panelClass: 'confirm-dialog-container',
      data : {
        type : detailsType,
        details : passeDetails
      }
      // data : user
    });
  }

  openEditDialog(passedDetails, detailsType : string) : Observable<any>{
    // console.log("the message is here :" + passedDetails.requestId);
    const dialogRef =  this.dialog.open(DetailsFormComponent, {
      width : '550px',
      disableClose : false,
      panelClass: 'confirm-dialog-container',
      data : {
        type : detailsType,
        details : passedDetails
      }
      // data : use
    });
    return dialogRef.afterClosed();
  }

  

  // openDetailsDialog(user : User, detailsType : string){
  //   console.log("the message is here :" + user.userRole);
  //   return this.dialog.open(DetailsFormComponent, {
  //     width : '550px',
  //     disableClose : false,
  //     panelClass: 'confirm-dialog-container',
  //     data : {
  //       type : detailsType,
  //       details : user
  //     }
  //     // data : user
  //   });
  // }

  openFarmerDetailsDialog(detailsType : string){
    console.log("in here" + detailsType);
    return this.dialog.open(DetailsFormComponent, {
      width : '550px',
      disableClose : false,
      panelClass: 'confirm-dialog-container',
      data : {
        type : detailsType,
        details : {
          name : "Heshan"
        }
      }
      // data : user
    });
  }

  // openFieldDetailsDialog(user : User){
  //   console.log("the message is here :" + user.userRole);
  //   return this.dialog.open(DetailsFormComponent, {
  //     width : '550px',
  //     disableClose : false,
  //     panelClass: 'confirm-dialog-container',
  //     data : {
  //       passedData : user,
  //       type : "fieldDetails"
  //     }
  //   });
  // }
}
