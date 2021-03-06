import { Component, OnInit } from '@angular/core';
import { User, UserCredential } from 'app/models/user.model';
import { UserService } from 'app/services/user.service';
import { Router } from '@angular/router';
import { Md5 } from 'ts-Md5/dist/md5';
import { ShowOnDirtyErrorStateMatcher } from '@angular/material/core';
import { ComponentsComponent } from 'app/components/components.component';
import { AuthenticationService } from 'app/services/authentication.service';
import { Message } from 'app/models/message.model';
import { DialogService } from 'app/services/dialog.service';
import { cpuUsage } from 'process';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  user: User = {
    email: '',
    firstName: '',
    lastName: '',
    nic: '',
    phone: '',
    userRole: '',
    district: '',
    division: '',
    province: '',
    image: '',
    status: '',
    registeredDate: '',
    createdDate: '',
    createdTimestamp: 0,
    modifiedDate: '',
    modifiedTimestamp: 0,
  };

  userCredential: UserCredential = {
    email: '',
    password: '',
    userID: '',
  };

  message: Message = {
    title: '',
    showMessage: '',
  }

  users: Array<any> = [];
  plainPassword = "";
  submitted = true;
  loading = false;

  constructor(private formBuilder: FormBuilder, private dialog: DialogService, private userService: UserService, private router: Router, private authenticationService: AuthenticationService) {
    console.log("in login constructor")
    if(authenticationService.isAlreadyLoggedIn){
      console.log("already signed in ");
      console.log("user details : ",authenticationService.getCurrentUser());
      this.ifloggedin(authenticationService.getCurrentUser());
    }
   }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group(
      {
        email: ['', [Validators.email, Validators.required]],
        firstName: ['', [Validators.required]],
        lastName: ['', [Validators.required]],
        nic: ['', [Validators.required]],
        userRole: ['', [Validators.required]],
        phoneNumber: ['', [Validators.required]],
      }
    )
  }

  ifloggedin(res){
    if (this.authenticationService.isLoggedIn) {
      console.log("this is the rederected url in login : " + this.authenticationService.redirectUrl);
      var redirect;
      console.log("User role : "+res.userRole);
      if (res.userRole == "agricultural officer") {
        if (res.status == "active") {
          this.loading = false;
          redirect = this.authenticationService.redirectUrl ? this.router.parseUrl(this.authenticationService.redirectUrl) : 'user-dashboard'
          this.router.navigateByUrl(redirect);
        } else if (res.status == "pending") {
          this.loading = false;
          this.message.title = "warning";
          this.message.showMessage = "You still haven't recieve the admin approval to interact with the system !!";
          this.dialog.openConfirmDialog(this.message).afterClosed().subscribe(res => {
            this.clearFields();
          })
        }else if (res.status == "inactive") {
          this.loading = false;
          this.message.title = "error";
          this.message.showMessage = "Please contact system admin to interact with the system !!";
          this.dialog.openConfirmDialog(this.message).afterClosed().subscribe(res => {
            this.clearFields();
          })
        }
      } else if (res.userRole == "admin") {
        console.log(this.authenticationService.isLoggedIn)
        // the redirect url should come here edit follow code and set the url
        redirect = this.authenticationService.redirectUrl ? this.router.parseUrl(this.authenticationService.redirectUrl) : 'admin-dashboard'
        this.router.navigateByUrl(redirect);
      } else {
        this.loading = false;
        this.message.title = "error";
        this.message.showMessage = "Invalid login !!"
        this.dialog.openConfirmDialog(this.message).afterClosed().subscribe(res => {
          this.clearFields();
        })
      }
    }
  }

  logInClicked() {
    this.loading = true;
    this.submitted = true;
    if (this.userCredential.email == "" || this.userCredential.password == "") {
      this.loading = false;
      this.message.title = "Error";
      this.message.showMessage = "You have to enter relevant fields to login !";
      this.dialog.openConfirmDialog(this.message).afterClosed().subscribe(res => {
        this.clearFields();
      })
    } else {
      this.authenticationService.logIn(this.userCredential)
        .then(res => {
          console.log(this.authenticationService.isLoggedIn)
          // console.log("This is the user id in login : " + this.userCredential.userID);
          // this.router.navigate(['/user-dashboard']);

          //testing region 
          // console.log("is logged in : " + this.authenticationService.isLoggedIn);
          
          this.ifloggedin(res);
          
          //end of the testing region

        }, err => {
          this.loading = false;
          this.message.title = "error";
          // console.log(err);
          if (err == "auth/wrong-password") {
            this.message.showMessage = "You have entered invalid password !";
          } else if (err == "auth/user-not-found") {
            this.message.showMessage = "The Email you have entered do not have an account here !";
          } else {
            this.message.showMessage = "Invalid Email and password !"
          }
          this.dialog.openConfirmDialog(this.message).afterClosed().subscribe(res => {
            this.clearFields();
          });
        })
    }

  }

  encryptPassword(password: string) {
    var originalPassword = password;

    const md5 = new Md5();
    var encryptedPassword = md5.appendStr(originalPassword).end().toString();       //to encrypt the pass using md5
    var finalPassword = btoa(encryptedPassword);                                    //to convert the encrypted pass to base64
    return finalPassword;
  }

  updateSessionDetails() {
    sessionStorage.setItem('email', this.user.email);
    sessionStorage.setItem('firstName', this.user.firstName);
    sessionStorage.setItem('lastName', this.user.lastName);
    sessionStorage.setItem('nic', this.user.nic);
    sessionStorage.setItem('phone', this.user.phone);
    sessionStorage.setItem('userRole', this.user.userRole);
    sessionStorage.setItem('district', this.user.district);
    sessionStorage.setItem('division', this.user.division);
    sessionStorage.setItem('province', this.user.province);
    sessionStorage.setItem('image', this.user.image);
    sessionStorage.setItem('status', this.user.status);
    sessionStorage.setItem('createdTimestamp', this.user.createdTimestamp.toString());
    sessionStorage.setItem('createdDate', this.user.createdDate);
    sessionStorage.setItem('modifiedDate', this.user.modifiedTimestamp.toString());
    sessionStorage.setItem('modifiedTimestamp', this.user.modifiedDate);
    sessionStorage.setItem('registeredDate', this.user.registeredDate);
  }

  clearFields() {
    this.userCredential.email = "";
    this.userCredential.password = "";
  }
}
