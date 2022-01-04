import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  focus: any;
  focus1: any;
  constructor(private router: Router) { }

  ngOnInit(): void {
  }
  viewFields() {
    this.router.navigate(['/fields']);
  }
  viewUsers() {
    this.router.navigate(['/farmers'], { state: { role: 'farmer' } });
  }
  viewRequests() {
    this.router.navigate(['/requests'], { state: { role: 'farmer', type: 'request' } });
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

  viewProfile() {
    this.router.navigate(['/updateuser']);
  }
}

