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
import { Router } from '@angular/router';

const NO_OF_WEEKS = 8;

@Component({
  selector: 'app-user-farmer-requests',
  templateUrl: './user-farmer-requests.component.html',
  styleUrls: ['./user-farmer-requests.component.css']
})
export class UserFarmerRequestsComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort : MatSort;

  user : User = {
    id : '',
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
    time : '',        
    name : '',
    registeredDate : '',
  };

  userCredential : UserCredential = {
    email : '',
    password : '',
    userID : '',
  };

  message : Message = {
    title : '',
    showMessage : ''
  }

  changedWeekDetails: LCCWeekDetails[];
  lccMainDetails : LCCMainDetails;
  havePreviousRecords : boolean = false;


  displayedColumns: string[] = ['week', 'levelOne', 'levelTwo', 'levelThree'];
  dataSource : MatTableDataSource<LCCWeekDetails>;

  constructor(private lccService : LccService, private dialog : DialogService, private router : Router) { }

  ngOnInit(): void {
    this.loadSessionDetails();
    this.getLCCDetails();
    // this.dataSource = new MatTableDataSource(this.changedWeekDetails);
    // setTimeout(() => this.dataSource.paginator = this.paginator);
    // setTimeout(() => this.dataSource.sort = this.sort);
    // this.dataSource.sort = this.sort;
    // this.dataSource.paginator = this.paginator;
  }

  applyFilter(filterValue : string){
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onChange(row){
    var weekNo = row.week;
    var rowDetails = row;
    this.changedWeekDetails[weekNo - 1] = rowDetails;
  }

  onSaveClick(){
    console.log("in the onsave" + this.changedWeekDetails);
    console.log(sessionStorage.getItem('userID'));
    this.lccMainDetails = {
      userID : '',
      division : '',
      weekDetails : this.changedWeekDetails
    };
    this.lccMainDetails.userID = sessionStorage.getItem('userID');
    this.lccMainDetails.division = sessionStorage.getItem('division');
    this.updateWeekDetails();
    this.lccMainDetails.weekDetails = this.changedWeekDetails;
    this.lccService.saveLccDetails(this.lccMainDetails, this.havePreviousRecords)
          .then(res =>{
              this.message.title = "success";
              this.message.showMessage = "You have successfully update the LCC details !";
              this.dialog.openConfirmDialog(this.message).afterClosed().subscribe(res =>{
              this.router.navigate(['/profile']);
              });
            }, err => {
              this.message.title = "error";
              this.message.showMessage = err;
              this.dialog.openConfirmDialog(this.message).afterClosed().subscribe(res =>{
            });
          }
        )
  }

  onCancelClick(){
    this.message.title = "warning";
    this.message.showMessage = "The changes you have done not be applied to the LCC details !";
    this.dialog.openConfirmDialog(this.message).afterClosed().subscribe(res =>{
      this.router.navigate(['/profile']);
      });
  }

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
  }

  updateWeekDetails(){
    for(var i = 0; i < NO_OF_WEEKS; i++ ){
      var j = i;
      if(this.changedWeekDetails[i] == undefined){
        this.changedWeekDetails[i] = {week: j+1, levelOne: 0, levelTwo: 0, levelThree: 0}
      }else{
        if(this.changedWeekDetails[i].levelOne == 0){
          this.changedWeekDetails[i].levelOne = 0;
        }if(this.changedWeekDetails[i].levelTwo == 0){
          this.changedWeekDetails[i].levelTwo = 0;
        }if(this.changedWeekDetails[i].levelThree == 0){
          this.changedWeekDetails[i].levelThree = 0;
        }
      } 
    }
  }

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
          this.dataSource = new MatTableDataSource(this.changedWeekDetails);
          setTimeout(() => this.dataSource.paginator = this.paginator);
          setTimeout(() => this.dataSource.sort = this.sort);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
        }else{
          this.changedWeekDetails = [
            {week: 1, levelOne: 0, levelTwo: 0, levelThree: 0},
            {week: 2, levelOne: 0, levelTwo: 0, levelThree: 0},
            {week: 3, levelOne: 0, levelTwo: 0, levelThree: 0},
            {week: 4, levelOne: 0, levelTwo: 0, levelThree: 0},
            {week: 5, levelOne: 0, levelTwo: 0, levelThree: 0},
            {week: 6, levelOne: 0, levelTwo: 0, levelThree: 0},
            {week: 7, levelOne: 0, levelTwo: 0, levelThree: 0},
            {week: 8, levelOne: 0, levelTwo: 0, levelThree: 0}
          ];
          this.dataSource = new MatTableDataSource(this.changedWeekDetails);
          setTimeout(() => this.dataSource.paginator = this.paginator);
          setTimeout(() => this.dataSource.sort = this.sort);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
        }
      }
    )
  }

}
