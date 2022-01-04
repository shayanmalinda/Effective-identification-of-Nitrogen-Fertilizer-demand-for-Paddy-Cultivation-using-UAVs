import { Component, Inject, OnInit } from '@angular/core';
import { Md5 } from 'ts-Md5/dist/md5';
import { UserService } from '../../services/user.service';
import { User, UserCredential } from 'app/models/user.model';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { Router } from '@angular/router';
import { AuthenticationService } from 'app/services/authentication.service';
import divisionalDataFile from '../../../assets/jsonfiles/divisions.json';
import { DialogService } from 'app/services/dialog.service';
import { Message } from 'app/models/message.model';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

    // loginForm = new FormGroup({
    //   email: new FormControl('', [Validators.email]),
    // })

    loginForm : FormGroup;

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
        // name : '',
        registeredDate : '',
    };

    userCredential : UserCredential = {
      email : '',
      password : '',
      userID : ''
    };

    message : Message = {
      title : '',
      showMessage : '',
    };

    divisionalData = divisionalDataFile;
    provinces = this.divisionalData.provinces;
    districts : any;
    divisions : any;
    provinceSelected : string;
    districtSelected : string;
    divisionSelected : string;
    submitted = false;



    constructor(private datepipe : DatePipe, private formBuilder : FormBuilder, private dialog : DialogService, private userService : UserService, private router: Router, private authenticationService : AuthenticationService) { }

    ngOnInit() {
      this.loginForm = this.formBuilder.group(
        {
          email: ['', [Validators.email, Validators.required]],
          firstName : ['',[Validators.required]],
          lastName : ['',[Validators.required]],
          nic : ['',[Validators.required]],
          userRole : ['',[Validators.required]],
          phoneNumber : ['',[Validators.required]],
        }
      )
    }

    // onSignUp(){
    //   if(this.email == ""){
    //     window.alert("Enter relevant values");
    //   }
    //   else{
    //     this.userService.getUserByEmail(this.email).subscribe(data => {
    //       if(data.docs.length.toString() > "0"){
    //         window.alert("This E-mail already has an account");
    //       }else if(this.replainPassword =="" || this.plainPassword == ""){
    //         window.alert("Enter relevant values");
    //       }else{
    //         if(this.plainPassword != this.replainPassword){
    //           window.alert("Enter same password in both occassions");
    //         }else if(this.plainPassword.length < 8){
    //           window.alert("The length of the password should be greater than 8");
    //         }else{
    //           // window.alert("This mail can use ");
    //           this.user.password = this.encryptPassword(this.plainPassword);
    //           this.user.email = this.email;
    //           this.userService.signUpUser(this.user);
    //           this.email = '';
    //           this.plainPassword = '';
    //           this.replainPassword = '';
    //           // this.userService.logInUser(this.user).subscribe(data => {
    //           //     data.docs.forEach(element => {      
    //           //         console.log(element.data());
    //           //         // this.users.push(element.data());
    //           //     });
    //           //     // console.log(this.users);
    //           // });
    //           this.userService.logInUser(this.user).subscribe(data => {
    //               if(data.docs.length > 0){
    //                   this.user = data.docs[0].data() as User;
    //                   this.user.docId = data.docs[0].id.toString();
    //                   // console.log("This is user details in user : " + this.user.email);
    //                   this.updateSessionDetails();
    //                   this.router.navigate(['/updateuser']);
    //                   // sessionStorage.setItem('docId',this.user.docId);
    //                   // sessionStorage.setItem('email',this.user.email);
    //                   // sessionStorage.setItem('password', this.user.password);
    //                   // sessionStorage.setItem('firstName',this.user.firstName);
    //                   // sessionStorage.setItem('lastName',this.user.lastName);
    //                   // sessionStorage.setItem('nic',this.user.nic);
    //                   // sessionStorage.setItem('phone',this.user.phone);
    //                   // sessionStorage.setItem('userRole',this.user.userRole);
    //                   // sessionStorage.setItem('district',this.user.district);
    //                   // sessionStorage.setItem('division',this.user.division);
    //                   // sessionStorage.setItem('province',this.user.province);
    //                   // sessionStorage.setItem('image',this.user.image);
    //               //   console.log(data.docs[0].data() + " tihs is the user "+ this.user.division +" "+ this.user.email +" "+ this.user.district);
    //                 // console.log("there is an element" + data.docs.length);
    //                 // data.docs.forEach(element => {   
    //                 //   // console.log(element.data());
    //                 //   // this.users.push(element.data());
    //                 //   // console.log(this.users); 
    //                 // });
    //               }else{
    //                 // console.log("there is no records");
    //               }
    //               // console.log(this.users);
    //           });
    //           // this.user.password = this.encryptPassword(this.plainPassword);
    //           // this.user.email = this.email;
    //           // this.userService.signUpUser(this.user);
    //           // this.email = '';
    //           // this.plainPassword = '';
    //           // this.replainPassword = '';
    //           // // this.userService.logInUser(this.user).subscribe(data => {
    //           // //     data.docs.forEach(element => {      
    //           // //         console.log(element.data());
    //           // //         // this.users.push(element.data());
    //           // //     });
    //           // //     // console.log(this.users);
    //           // // });
    //           // this.userService.logInUser(this.user).subscribe(data => {
    //           //     if(data.docs.length > 0){
    //           //         this.user = data.docs[0].data() as User;
    //           //         this.user.docId = data.docs[0].id.toString();
    //           //         // console.log("This is user details in user : " + this.user.email);
    //           //         this.updateSessionDetails();
    //           //         this.router.navigate(['/updateuser']);
    //           //         // sessionStorage.setItem('docId',this.user.docId);
    //           //         // sessionStorage.setItem('email',this.user.email);
    //           //         // sessionStorage.setItem('password', this.user.password);
    //           //         // sessionStorage.setItem('firstName',this.user.firstName);
    //           //         // sessionStorage.setItem('lastName',this.user.lastName);
    //           //         // sessionStorage.setItem('nic',this.user.nic);
    //           //         // sessionStorage.setItem('phone',this.user.phone);
    //           //         // sessionStorage.setItem('userRole',this.user.userRole);
    //           //         // sessionStorage.setItem('district',this.user.district);
    //           //         // sessionStorage.setItem('division',this.user.division);
    //           //         // sessionStorage.setItem('province',this.user.province);
    //           //         // sessionStorage.setItem('image',this.user.image);
    //           //     //   console.log(data.docs[0].data() + " tihs is the user "+ this.user.division +" "+ this.user.email +" "+ this.user.district);
    //           //       // console.log("there is an element" + data.docs.length);
    //           //       // data.docs.forEach(element => {   
    //           //       //   // console.log(element.data());
    //           //       //   // this.users.push(element.data());
    //           //       //   // console.log(this.users); 
    //           //       // });
    //           //     }else{
    //           //       // console.log("there is no records");
    //           //     }
    //           //     // console.log(this.users);
    //           // });
    //         }
    //       }
    //     })
    //   }
      
      
      
      
      
    // }

    signUpClicked(){
      this.submitted = true;
      this.user.email = this.userCredential.email;
      this.user.registeredDate = this.datepipe.transform((new Date), 'MMM d, y h:mm:ss a').toString();
      this.user.status = "pending";
      this.user.userRole = "agricultural officer"
        if(this.provinceSelected == undefined || this.user.firstName == '' || 
          this.user.lastName == '' || this.user.nic == '' || this.user.phone == '' || 
          this.user.userRole == '')
        {
          this.message.title = "error";
          this.message.showMessage = "You have to enter relevant fields to register !";
          this.dialog.openConfirmDialog(this.message);
        }else{
          this.authenticationService.signUp(this.userCredential, this.user)
          .then(res =>{
              this.message.title = "success";
              this.message.showMessage = "You have successfully registered within the system and wait until the system administor's approval !";
              this.dialog.openConfirmDialog(this.message).afterClosed().subscribe(res =>{
                this.router.navigate(['/login']);
              });
            }, err => {
              this.message.title = "error";
              this.message.showMessage = err;
              this.dialog.openConfirmDialog(this.message).afterClosed().subscribe(res =>{
                this.clearFields();
            });
          }
        )
      }
      

      // if(this.successMessage == "success"){
      //   console.log("in the success section");
      //   this.message.title = "success";
      //   this.message.showMessage = this.errorMessage;
      //   this.dialog.openConfirmDialog(this.message);
      // }else{
      //   console.log("in the error section")
      //   this.message.title = "error";
      //   this.message.showMessage = this.errorMessage;
      //   this.dialog.openConfirmDialog(this.message);
      // }
      
      // this.message.title = "succesS";
      // this.message.showMessage = "this is the success msg";
      // this.dialog.openConfirmDialog(this.message);
      // console.log("This is after the message");
    }

    encryptPassword(password : string){
        var originalPassword = password;

        const md5 = new Md5();
        var encryptedPassword = md5.appendStr(originalPassword).end().toString();       //to encrypt the pass using md5
        var finalPassword = btoa(encryptedPassword);                                    //to convert the encrypted pass to base64
        return finalPassword;
    }

    updateSessionDetails(){
        sessionStorage.setItem('email',this.userCredential.email);
        sessionStorage.setItem('firstName',this.user.firstName);
        sessionStorage.setItem('lastName',this.user.lastName);
        sessionStorage.setItem('nic',this.user.nic);
        sessionStorage.setItem('phone',this.user.phone);
        sessionStorage.setItem('userRole',this.user.userRole);
        sessionStorage.setItem('district',this.user.district);
        sessionStorage.setItem('division',this.user.division);
        sessionStorage.setItem('province',this.user.province);
        sessionStorage.setItem('image',this.user.image);
        sessionStorage.setItem('status',this.user.status);
    }

    showSuccessMessage(
      title, message, icon = null,
      showCancelButton = true){
      return Swal.fire({
        title: title,
        text: message,
        icon: icon,
        showCancelButton: showCancelButton
      })
    }

    onProvinceSelected(value : any){
      var province = value.toString();
      this.user.province = province;
      this.districts = this.divisionalData["" + province + ""];
      this.districtSelected = this.divisionalData["" + province + ""][0];
      this.divisions = this.divisionalData["" + this.districtSelected + ""];
      this.divisionSelected = this.divisionalData["" + this.districtSelected + ""][0];
      this.user.district = this.districtSelected;
      this.user.division = this.divisionSelected;
    }

    onDistrictSelected(value : any){
      var district = value.toString();
      this.user.district = district;
      this.divisions = this.divisionalData["" + district + ""];
      this.divisionSelected = this.divisionalData["" + district + ""][0];
      this.user.division = this.divisionSelected;
    }

    onDivisionSelected(value : any){
      var division = value.toString();
      this.user.division = division;
    }

    clearFields(){
      this.userCredential.email = "";
      this.userCredential.password = "";
      this.user.firstName = "";
      this.user.lastName = "";
      this.districtSelected = undefined;
      this.divisionSelected = undefined;
      this.provinceSelected = undefined;
      this.user.nic = "";
      this.user.userRole = "";
      this.user.phone = "";
    }

    get f(): { [key: string]: AbstractControl } {
      return this.loginForm.controls;
    }
}
