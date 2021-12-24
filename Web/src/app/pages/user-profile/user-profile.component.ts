
import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user.model';
import { Router } from '@angular/router';
@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  users: User[];
  user: User;

  constructor(private router: Router) {
    this.user = this.router.getCurrentNavigation().extras.state.user;
  }


  ngOnInit() {

  }
 

}

