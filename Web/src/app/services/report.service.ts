import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(private router : Router) { }

  onFarmersReportClick(type : string){
    this.router.navigate(['/user-reports'], { state : { type : type }});
  }
}
