import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { Message } from 'app/models/message.model';
import { User } from 'app/models/user.model';


@Component({
  selector: 'app-details-form',
  templateUrl: './details-form.component.html',
  styleUrls: ['./details-form.component.css']
})
export class DetailsFormComponent implements OnInit {

  btnStyleOne : string  = "";
  btnTextOne : string  = "";
  isVisible : boolean = true;

  constructor(@Inject(MAT_DIALOG_DATA) public data: User, private matDialogRef : MatDialogRef<DetailsFormComponent>) { 
    // console.log("this is the user role : " + data.userRole);
    this.btnStyleOne = "btn btn-success btn-round margin-left : 500px";
    this.btnTextOne = "ok";
  }

  ngOnInit(): void {
    
  }

}
