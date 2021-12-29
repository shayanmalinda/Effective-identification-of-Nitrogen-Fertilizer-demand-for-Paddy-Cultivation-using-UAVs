import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { Message } from 'app/models/message.model';

@Component({
  selector: 'app-show-message',
  templateUrl: './show-message.component.html',
  styleUrls: ['./show-message.component.css']
})
export class ShowMessageComponent implements OnInit {

  titleStyle : string = "";
  btnStyleOne : string  = "";
  btnStyleTwo : string  = "";
  btnTextOne : string  = "";
  btnTextTwo : string  = "";
  isVisible : boolean = true;

  constructor(@Inject(MAT_DIALOG_DATA) public data: Message, private matDialogRef : MatDialogRef<ShowMessageComponent>) { 
    this.data.title = this.data.title.toUpperCase();
    if(this.data.title == "SUCCESS"){
      this.titleStyle = "padding-top: 30px; color: green";
      this.btnStyleOne = "btn btn-success btn-round";
      this.btnTextOne = "ok";
    }else if(this.data.title == "ERROR"){
      this.titleStyle = "padding-top: 30px; color: red";
      this.btnStyleOne = "btn btn-danger btn-round";
      this.btnTextOne = "ok";
    }else if(this.data.title == "WARNING"){
      this.titleStyle = "padding-top: 30px; color: orange";
      this.btnStyleOne = "btn btn-warning btn-round";
      this.btnTextOne = "ok";
    }else if(this.data.title == "SUCCESSMORE"){
      this.isVisible = true;
      this.titleStyle = "padding-top: 30px; color: green";
      this.btnStyleOne = "btn btn-success btn-round";
      this.btnTextOne = "ok";
      this.btnStyleTwo = "btn btn-danger btn-round";
      this.btnTextTwo = "cancel";
    }else if(this.data.title == "ERRORMORE"){
      this.isVisible = true;
      this.titleStyle = "padding-top: 30px; color: red";
      this.btnStyleOne = "btn btn-danger btn-round";
      this.btnTextOne = "ok";
      this.btnStyleTwo = "btn btn-default btn-round";
      this.btnTextTwo = "cancel";
    }else if(this.data.title == "WARNINGMORE"){
      this.isVisible = true;
      this.titleStyle = "padding-top: 30px; color: orange";
      this.btnStyleOne = "btn btn-warning btn-round";
      this.btnTextOne = "ok";
      this.btnStyleTwo = "btn btn-default btn-round";
      this.btnTextTwo = "cancel";
    }
  }

  ngOnInit(): void {
    
  }

  closeMessage(){
    // this.matDialogRef.close(false);
  }

}
