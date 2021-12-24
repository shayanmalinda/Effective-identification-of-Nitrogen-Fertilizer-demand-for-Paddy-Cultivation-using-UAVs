import { DOCUMENT } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})

export class ProfileComponent implements OnInit {

    users: User[];
    user:User;

    constructor(private userService: UserService) {
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
