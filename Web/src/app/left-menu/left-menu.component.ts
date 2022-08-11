import { Component, Input, OnInit } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-left-menu',
  templateUrl: './left-menu.component.html',
  styleUrls: ['./left-menu.component.css']
})
export class LeftMenuComponent implements OnInit {

  @Input() routename:string;
  constructor(private router: Router) { 
    
  }

  onReportsButtonClick(){
    this.router.navigate(['/user-reports'], { state : { type : "lcc" }});
  }

  isRouterActive(name:string){
    
    if(this.routename==name){
      return true;
    }
    return false;
  }

  getTextColor(name:string){
    
    if(this.isRouterActive(name)){
      return "black"
    }else{
      return"white";
    }
  }

  ngOnInit(): void {
  }

}
