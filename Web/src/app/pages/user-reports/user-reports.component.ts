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

const NO_OF_WEEKS = 8;

@Component({
  selector: 'app-user-reports',
  templateUrl: './user-reports.component.html',
  styleUrls: ['./user-reports.component.css']
})
export class UserReportsComponent implements OnInit {

  user : User = {
    email: '',
    firstName: '',
    lastName: '',
    nic: '',
    phone: '',
    userRole: '',
    district: '',
    division: '',
    province: '',          
    image : '',      
    status : '',   
    registeredDate : '',
    createdDate: '',
    createdTimestamp: 0,
    modifiedDate: '',
    modifiedTimestamp : 0,
  };

  userCredential : UserCredential = {
    email : '',
    password : '',
    userID : '',
  };

  changedWeekDetails: LCCWeekDetails[];
  lccMainDetails : LCCMainDetails;
  havePreviousRecords : boolean = false;
  displayedColumns: string[] = ['week', 'levelTwo', 'levelThree', 'levelFour'];
  dataSource : MatTableDataSource<LCCWeekDetails>;

  documentName = "Sample Name";
  date : string;
  province = "Sample Province";
  district = "Sample District";
  division = "Sample Division";
  loading = true;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort : MatSort;
  reportType = sessionStorage.getItem('reportType');

  constructor(private lccService : LccService, private datepipe : DatePipe) { 
    this.date  = this.datepipe.transform((new Date), 'MMM d, y').toString();
    this.documentName = "LCC Report";
  }

  ngOnInit(): void {
    this.loadSessionDetails();
    this.getLCCDetails();
  }

  //load the session details
  loadSessionDetails(){
    this.userCredential.userID = sessionStorage.getItem('userID');
    this.user.status = sessionStorage.getItem('status');
    this.user.firstName = (sessionStorage.getItem("firstName") != "" ? sessionStorage.getItem("firstName") : "");
    this.user.lastName = (sessionStorage.getItem("lastName") != "" ? sessionStorage.getItem("lastName") : "");
    this.user.nic = (sessionStorage.getItem("nic") != "" ? sessionStorage.getItem("nic") : "");
    this.user.email = (sessionStorage.getItem("email") != "" ? sessionStorage.getItem("email") : "");
    this.user.userRole = (sessionStorage.getItem("userRole") != "" ? sessionStorage.getItem("userRole") : "");
    this.user.phone = (sessionStorage.getItem("phone") != "" ? sessionStorage.getItem("phone") : "");
    this.user.division = (sessionStorage.getItem("division") != "" ? sessionStorage.getItem("division") : "");
    this.user.district = (sessionStorage.getItem("district") != "" ? sessionStorage.getItem("district") : "");
    this.user.province = (sessionStorage.getItem("province") != "" ? sessionStorage.getItem("province") : "");
    this.user.image = (sessionStorage.getItem("image") != "" ? sessionStorage.getItem("image") : "./assets/img/faces/user_profile_default.jpg");
    this.province = this.user.province;
    this.district = this.user.district;
    this.division = this.user.division;
  }

    //to get the LCC details
    getLCCDetails(){
      this.user.division = sessionStorage.getItem('division');
      this.lccService.getLccDetailsByDivision(this.user).subscribe(
        data => {
          if(data.docs.length > 0){
            this.havePreviousRecords = true;
            this.lccMainDetails = data.docs[0].data() as LCCMainDetails;
            this.changedWeekDetails = this.lccMainDetails.weekDetails;
            sessionStorage.setItem('LCCID', data.docs[0].id);
            console.log(this.changedWeekDetails);
            // this.dataSource = new MatTableDataSource(this.changedWeekDetails);
            // setTimeout(() => this.dataSource.paginator = this.paginator);
            // setTimeout(() => this.dataSource.sort = this.sort);
            // this.dataSource.sort = this.sort;
            // this.dataSource.paginator = this.paginator;
          }else{
            this.lccService.getLccWithoutDivision().subscribe(
              data => {
                console.log("no records : ");
                this.lccMainDetails = data.docs[0].data() as LCCMainDetails;
                this.changedWeekDetails = this.lccMainDetails.weekDetails;
                sessionStorage.setItem('LCCID', data.docs[0].id);
                console.log(this.changedWeekDetails);
                this.dataSource = new MatTableDataSource(this.changedWeekDetails);
                setTimeout(() => this.dataSource.paginator = this.paginator);
                setTimeout(() => this.dataSource.sort = this.sort);
                this.dataSource.sort = this.sort;
                this.dataSource.paginator = this.paginator;
              }
            )
            // this.changedWeekDetails = [
            //   {week: 1, levelFour: 0, levelTwo: 0, levelThree: 0},
            //   {week: 2, levelFour: 0, levelTwo: 0, levelThree: 0},
            //   {week: 3, levelFour: 0, levelTwo: 0, levelThree: 0},
            //   {week: 4, levelFour: 0, levelTwo: 0, levelThree: 0},
            //   {week: 5, levelFour: 0, levelTwo: 0, levelThree: 0},
            //   {week: 6, levelFour: 0, levelTwo: 0, levelThree: 0},
            //   {week: 7, levelFour: 0, levelTwo: 0, levelThree: 0},
            //   {week: 8, levelFour: 0, levelTwo: 0, levelThree: 0}
            // ];
            // this.dataSource = new MatTableDataSource(this.changedWeekDetails);
            // setTimeout(() => this.dataSource.paginator = this.paginator);
            // setTimeout(() => this.dataSource.sort = this.sort);
            // this.dataSource.sort = this.sort;
            // this.dataSource.paginator = this.paginator;
          }
          this.dataSource = new MatTableDataSource(this.changedWeekDetails);
          setTimeout(() => this.dataSource.paginator = this.paginator);
          setTimeout(() => this.dataSource.sort = this.sort);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
          this.loading = false;
        }
      )
    }
}
