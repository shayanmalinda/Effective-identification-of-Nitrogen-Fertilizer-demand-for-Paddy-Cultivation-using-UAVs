import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user.model';
import { UserService } from 'app/services/user.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  users : Array<any> = [];
  user : any;

  constructor(private userService : UserService) { 
  }

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers (){
    // this.users = this.userService.getUsers();
    // this.users = [
    //   {
    //     email: "Heshan kavinda",
    //     firstName: '',
    //     lastName: '',
    //     nic: '',
    //     phone: '',
    //     userRole: '',
    //     district: '',
    //     division: '',
    //     province: ''
    //   },
    //   {
    //     email: "Kaveesha Shaminda",
    //     firstName: '',
    //     lastName: '',
    //     nic: '',
    //     phone: '',
    //     userRole: '',
    //     district: '',
    //     division: '',
    //     province: ''
    //   },
    //   {
    //     email: "Hello lanka",
    //     firstName: '',
    //     lastName: '',
    //     nic: '',
    //     phone: '',
    //     userRole: '',
    //     district: '',
    //     division: '',
    //     province: ''
    //   },
    // ];
    // this.userService.getUsers().subscribe(data=>{
    //   console.log(data);
    // })

    this.userService.getallUsers()
        .subscribe(data => {
            data.docs.forEach(element => {      
                console.log(element.data());
                // this.users.push(element.data());
            });
            // console.log(this.users);
        });
  }

}
