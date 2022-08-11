import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ShowMessageComponent } from 'app/show-message/show-message.component';
import { Message } from 'app/models/message.model';
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
    });
  }

  openEditDialog(passedDetails, detailsType : string) : Observable<any>{
    const dialogRef =  this.dialog.open(DetailsFormComponent, {
      width : '550px',
      disableClose : false,
      panelClass: 'confirm-dialog-container',
      data : {
        type : detailsType,
        details : passedDetails
      }
    });
    return dialogRef.afterClosed();
  }


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
    });
  }

}
