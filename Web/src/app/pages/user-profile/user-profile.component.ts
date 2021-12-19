
import { DOCUMENT } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { Router } from '@angular/router';
@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {


  @Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
  })


  users: User[];
  user: User;

  constructor(private userService: UserService, private router: Router) {
    this.user = this.router.getCurrentNavigation().extras.state.user;

  }


  ngOnInit() {

    // this.userService.getUser("86728615V")
    // .subscribe(data => {
    //     data.docs.forEach(element => {      
    //         this.user=element.data() as User;
    //     });

    // });
  }
  // printUser(){
  //     console.log(this.user.firstName);
  // }

}

