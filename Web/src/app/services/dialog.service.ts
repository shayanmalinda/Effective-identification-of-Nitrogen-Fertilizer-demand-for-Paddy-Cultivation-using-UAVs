import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ShowMessageComponent } from 'app/show-message/show-message.component';
import { Message } from 'app/models/message.model';

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
}
