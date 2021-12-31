import { DOCUMENT } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { Router } from '@angular/router';
import { AuthenticationService } from 'app/services/authentication.service';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})

export class ProfileComponent implements OnInit {

    user : User = {
        id : '',
        email: '',
        firstName: '',
        lastName: '',
        nic: '',
        phone: '',
        userRole: '',
        district: '',
        division: '',
        province: '',       
        image : '',      
        status : '',      
        time : '',        
        name : '',
        registeredDate : '',
      };
    cardImageBase64: string;
    fullName : string;
    location : string;
    constructor(private userService: UserService, private authentication : AuthenticationService,private router : Router) {
    }
    
    ngOnInit() : void{
        this.loadSessionDetails();
        if(this.user.firstName == "" && this.user.lastName == ""){
            this.fullName = "Full name";
        }
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

    onUpdateClick(){
        // console.log("profile clicked");
        this.updateSessionDetails();
        this.router.navigate(['/updateuser']);
    }

    onLogoutClick(){
        this.authentication.logOut();
        this.router.navigate(['/login']);
    }

    onLccDetailsClick(){
        this.authentication.logOut();
        this.router.navigate(['/lcc-details']);
    }

    loadSessionDetails(){
        // this.user.docId = (sessionStorage.getItem("docId") != "" ? sessionStorage.getItem("docId") : "");
        this.user.firstName = (sessionStorage.getItem("firstName") != "" ? sessionStorage.getItem("firstName") : "");
        this.user.lastName = (sessionStorage.getItem("lastName") != "" ? sessionStorage.getItem("lastName") : "");
        this.user.nic = (sessionStorage.getItem("nic") != "" ? sessionStorage.getItem("nic") : "");
        this.user.email = (sessionStorage.getItem("email") != "" ? sessionStorage.getItem("email") : "");
        this.user.userRole = (sessionStorage.getItem("userRole") != "" ? (sessionStorage.getItem("userRole").replace(/\s/g, "").toLowerCase() == "agriculturalofficer" ? "Agricultural Officer" : sessionStorage.getItem("userRole")) : "");
        this.user.phone = (sessionStorage.getItem("phone") != "" ? sessionStorage.getItem("phone") : "");
        this.user.division = (sessionStorage.getItem("division") != "" ? sessionStorage.getItem("division") : "");
        this.user.district = (sessionStorage.getItem("district") != "" ? sessionStorage.getItem("district") : "");
        this.user.province = (sessionStorage.getItem("province") != "" ? sessionStorage.getItem("province") : "");
        this.user.status = (sessionStorage.getItem("status") != "" ? sessionStorage.getItem("status") : "");
        // this.user.password = sessionStorage.getItem("password");
        this.user.image = (sessionStorage.getItem("image") != "" ? sessionStorage.getItem("image") : "./assets/img/faces/user_profile_default.jpg");
        this.fullName = this.user.firstName + " " + this.user.lastName;
        // console.log(this.fullName);
    }

    updateSessionDetails(){
        // sessionStorage.setItem('docId',this.user.docId);
        sessionStorage.setItem('email',this.user.email);
        // sessionStorage.setItem('password', this.user.password);
        sessionStorage.setItem('firstName',this.user.firstName);
        sessionStorage.setItem('lastName',this.user.lastName);
        sessionStorage.setItem('nic',this.user.nic);
        sessionStorage.setItem('phone',this.user.phone);
        sessionStorage.setItem('userRole',this.user.userRole);
        sessionStorage.setItem('district',this.user.district);
        sessionStorage.setItem('division',this.user.division);
        sessionStorage.setItem('province',this.user.province);
        sessionStorage.setItem('image',this.user.image);
    }
    // printUser(){
    //     console.log(this.user.firstName);
    // }

}
