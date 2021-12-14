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
    constructor(private userService: UserService) {
    }

    ngOnInit() {
        this.userService.getUsers().subscribe(data => {
            this.users = data.map(e => {
                return {
                    ...e.payload.doc.data() as User
                };
            });
            this.users.forEach(a => {
                console.log(a.firstName);
            });
        });
    }

}
