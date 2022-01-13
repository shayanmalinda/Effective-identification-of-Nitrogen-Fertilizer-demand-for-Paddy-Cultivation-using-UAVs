import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {

  constructor(private router : Router) { }

  ngOnInit(): void {
  }

  // onProfileClick(){
  //   this.router.navigate(['/profile']);
  // }

  viewFields() {
    this.router.navigate(['/fields']);
  }
  viewUsers() {
    this.router.navigate(['/users'], { state: { role: 'user' } });
  }
  viewRequests() {
    this.router.navigate(['/requests'], { state: { role: 'user', type: 'request' } });
  }
  viewOfficerRequests() {
    this.router.navigate(['/officer-requests'], { state: { role: 'officer', type: 'request' } });
  }
  viewOfficers() {
    this.router.navigate(['/officers'], { state: { role: 'officer'} });
  }

  viewFieldVisits() {
    this.router.navigate(['/field-visits']);
  }

  onReportsButtonClick(){
    console.log("comes here ");
    this.router.navigate(['/user-reports'], { state : { type : "lcc" }});
  }

}
