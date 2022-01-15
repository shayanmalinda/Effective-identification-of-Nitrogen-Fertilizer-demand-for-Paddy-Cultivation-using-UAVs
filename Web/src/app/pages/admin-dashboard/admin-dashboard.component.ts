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
  type: any;
  constructor(private router: Router) { }

  ngOnInit(): void {
  }
  viewFields() {
    this.router.navigate(['/fields']);
  }
  viewReports() {
    this.type = 'reports';
  }
  viewNav() {
    this.type = '';
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
    this.router.navigate(['/officers'], { state: { role: 'officer' } });
  }
  viewDivisions() {
    this.router.navigate(['/divisions'], { state: { role: 'officer', type: '' } });
  }

  viewFieldVisits() {
    this.router.navigate(['/field-visits'], { state: { fieldId: 'all', type: 'visit' } });
  }
  viewFieldVisitRequests() {
    this.router.navigate(['/field-visit-requests'], { state: { fieldId: 'all', type: 'request' } });
  }

  viewProfile() {
    this.router.navigate(['/admin-profile'], { state: { type: 'admin' } });
  }
  divisionReports() {
    this.router.navigate(['/select-report'], { state: { role: 'officer', type: 'division' } });
  }
  officerReports() {
    this.router.navigate(['/admin-officer-reports'], { state: { role: 'agricultural officer' } });
    // this.router.navigate(['/select-report'], { state: { role: 'officer', type: 'officer' } });
  }
  farmerReports() {
    // this.router.navigate(['/select-report'], { state: { role: 'officer', type: 'farmer' } });
    this.router.navigate(['/admin-farmer-reports'], { state: { role: 'farmer' } });
  }
  fieldReports() {
    this.router.navigate(['/admin-field-reports'], { state: { role: 'field' } });
  }
  requestReports() {
    this.router.navigate(['/select-report'], { state: { role: 'officer', type: 'request' } });
  }
  visitReports() {
    this.router.navigate(['/select-report'], { state: { role: 'officer', type: 'field' } });
  }
}

