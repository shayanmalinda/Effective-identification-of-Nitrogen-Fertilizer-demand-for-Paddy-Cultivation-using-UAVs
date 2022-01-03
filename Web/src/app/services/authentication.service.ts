import { ThrowStmt } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { User, UserCredential } from 'app/models/user.model';
import { AngularFireAuth } from '@angular/fire/auth';
import { UserService } from './user.service';
import { Router, RouteReuseStrategy } from '@angular/router';
import { Message } from 'app/models/message.model';
import { DialogService } from './dialog.service';
import { tap, delay } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

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

  message : Message;

  isLoggedIn = false;
  redirectUrl : string;

  constructor(private dialog : DialogService, private angularFireAuth : AngularFireAuth, private userService : UserService, private router : Router) { }

  //sign up service with authentication in firebase
  // signUp(userCredential : UserCredential, user : User){
  //   this.angularFireAuth.createUserWithEmailAndPassword(userCredential.email, userCredential.password)
  //   .then(res => {
  //     userCredential.userID = res.user.uid;
  //     sessionStorage.setItem("userID", res.user.uid);
  //     this.userService.addUser(userCredential,user);
  //     this.updateSessionDetails(userCredential, user);
  //     console.log(res);
  //     // console.log("it comes here ")
  //     // this.router.navigate(['/profile']);   //should be updated as dashboard !!!
  //   })
  //   .catch(err =>{
  //     if(err.message == "Password should be at least 6 characters"){
  //       alert("The password should be at least 6 characters");
  //       //the error msg is here
  //     }
  //     if(err.message == "The email address is badly formatted."){
  //       alert("The email address is badly formatted.");
  //       //the error msg is here
  //     }
  //     if(err.message == "The email address is already in use by another account."){
  //       alert("The email address is already in use by another account.");
  //       //the error msg is here
  //     }
      
  //     return "";
  //   })
  // }

  signUp(userCredential : UserCredential, user : User){
    return new Promise<any>((resolve, reject) => {
      this.angularFireAuth.createUserWithEmailAndPassword(userCredential.email, userCredential.password)
    .then(
      res => {
      userCredential.userID = res.user.uid;
      sessionStorage.setItem("userID", res.user.uid);
      this.userService.addUser(userCredential,user);
      this.updateSessionDetails(userCredential, user);
      this.isLoggedIn = true;
      resolve("Success");
    }
      ,err => reject(err.message))
    })
  }

  //log in service with authentication in firebase
  logIn(userCredential : UserCredential){
    var response;
    return new Promise<any>((resolve, reject) =>{
      this.angularFireAuth.signInWithEmailAndPassword(userCredential.email, userCredential.password)
      .then(
        res => {
          this.userService.getUserByEmail(userCredential).subscribe(data => {
            if(data.docs.length > 0){
              this.user = data.docs[0].data() as User;
              userCredential.userID = data.docs[0].id;
              this.updateSessionDetails(userCredential,this.user);
              this.isLoggedIn = true;
              resolve(this.user.userRole);
            }
            // if(data.docs.length == 0){
            //   resolve("error")
            // }
          })
        // userCredential.userID = res.user.uid;
        // sessionStorage.setItem("userID", res.user.uid);
        // this.userService.addUser(userCredential,user);
        // this.updateSessionDetails(userCredential, user);
        }
        ,err => {
          reject(err.code)
        })
      })
  }

  //log out service with authentication in firebase
  logOut(){
    this.isLoggedIn = false;
    this.angularFireAuth.signOut();
    this.removeSessionDetails();
  }

  updateSessionDetails(userCredential : UserCredential, user : User){
    sessionStorage.setItem('email',userCredential.email);
    sessionStorage.setItem('userID',userCredential.userID);
    sessionStorage.setItem('firstName',user.firstName);
    sessionStorage.setItem('lastName',user.lastName);
    sessionStorage.setItem('nic',user.nic);
    sessionStorage.setItem('phone',user.phone);
    sessionStorage.setItem('userRole',user.userRole);
    sessionStorage.setItem('district',user.district);
    sessionStorage.setItem('division',user.division);
    sessionStorage.setItem('province',user.province);
    sessionStorage.setItem('image',user.image);
    sessionStorage.setItem('status',user.status);
  }

  removeSessionDetails(){
    sessionStorage.removeItem('docId');
    sessionStorage.removeItem('firstName');
    sessionStorage.removeItem('lastName');
    sessionStorage.removeItem('nic');
    sessionStorage.removeItem('email');
    sessionStorage.removeItem('userRole');
    sessionStorage.removeItem('phone');
    sessionStorage.removeItem('division');
    sessionStorage.removeItem('district');
    sessionStorage.removeItem('province');
    sessionStorage.removeItem('password');
    sessionStorage.removeItem('image');
    sessionStorage.removeItem('userID');
    sessionStorage.removeItem('status');
  }

  //to secure the routes
  login(): Observable<boolean> {
    return of(true).pipe(
      delay(1000),
      tap(val => this.isLoggedIn = true)
    );
  }

  //to sercure the routes
  logout(): void {
    this.isLoggedIn = false;
  }
}
