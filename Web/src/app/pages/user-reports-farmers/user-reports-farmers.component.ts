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
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-user-reports-farmers',
  templateUrl: './user-reports-farmers.component.html',
  styleUrls: ['./user-reports-farmers.component.css']
})
export class UserReportsFarmersComponent implements OnInit {

  documentName = "Sample Name";
  date : string;
  province = "Sample Province";
  district = "Sample District";
  division = "Sample Division";
  displayedColumns: string[] = ['registrationNumber', 'address', 'fullName', 'phone'];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort : MatSort;
  reportType = "Farmers Report";

  constructor(private datepipe : DatePipe) { 
    this.date  = this.datepipe.transform((new Date), 'MMM d, y').toString();
    this.documentName = "Farmers Report";
  }

  ngOnInit(): void {
  }

  
}