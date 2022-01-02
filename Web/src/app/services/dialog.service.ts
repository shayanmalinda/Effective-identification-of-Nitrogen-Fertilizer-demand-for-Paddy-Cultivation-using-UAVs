import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ShowMessageComponent } from 'app/show-message/show-message.component';
import { Message } from 'app/models/message.model';
import { User } from 'app/models/user.model';
import { DetailsFormComponent } from 'app/details-form/details-form.component';

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

  openDetailsDialog(user : User){
    console.log("the message is here :" + user.userRole);
    return this.dialog.open(DetailsFormComponent, {
      width : '550px',
      disableClose : false,
      panelClass: 'confirm-dialog-container',
      data : user
    });
  }
}
