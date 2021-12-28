
import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user.model';
import { Router } from '@angular/router';
import { UserService } from 'app/services/user.service';
@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  users: User[];
  user: User;

  constructor(private router: Router,private userService: UserService) {
    this.user = this.router.getCurrentNavigation().extras.state.user;
  }


  ngOnInit() {

  }

  accept() {
    console.log('ss');
    this.userService.acceptUser(this.user.id);
  }
  decline() {
    this.userService.declineUser(this.user.id);
  }
 

}

