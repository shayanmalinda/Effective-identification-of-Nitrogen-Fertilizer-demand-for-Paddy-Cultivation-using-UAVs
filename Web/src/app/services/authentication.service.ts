import { Injectable } from '@angular/core';
import { User, UserCredential } from 'app/models/user.model';
import { AngularFireAuth } from '@angular/fire/auth';
import { UserService } from './user.service';
import { Router, RouteReuseStrategy } from '@angular/router';
import { Message } from 'app/models/message.model';
import { DialogService } from './dialog.service';
import { tap, delay } from 'rxjs/operators';
import { BehaviorSubject, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  user : User = {
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
    registeredDate : '',
    createdDate: '',
    createdTimestamp: 0,
    modifiedDate: '',
    modifiedTimestamp : 0,
  };

  message : Message;

  isLoggedIn = false;
  redirectUrl : string;

  loggedIn = new BehaviorSubject<boolean>(false);
  loggedIn$ = this.loggedIn.asObservable();

  constructor(private dialog : DialogService, 
    private angularFireAuth : AngularFireAuth, 
    private userService : UserService, 
    private router : Router) 
    { 
      this.angularFireAuth.onAuthStateChanged((user) => {
        if (user) {
          this.loggedIn.next(true);
          this.isLoggedIn=true;
        }else {
          // not logged in
          this.loggedIn.next(false);
          this.isLoggedIn=false;
        } 
    });
    
  }


  isAlreadyLoggedIn(): boolean {
    return !!this.angularFireAuth.currentUser;
  }

  getCurrentUser(){
    var u=new User();
    u.email=sessionStorage.getItem('email')
    u.firstName=sessionStorage.getItem('firstName');
    u.lastName=sessionStorage.getItem('lastName');
    u.nic=sessionStorage.getItem('nic');
    u.phone=sessionStorage.getItem('phone');
    u.userRole=sessionStorage.getItem('userRole');
    u.status=sessionStorage.getItem('status');
    u.division=sessionStorage.getItem('division');
    u.district=sessionStorage.getItem('district');
    u.province=sessionStorage.getItem('province');
    u.image=sessionStorage.getItem('image');
    u.registeredDate=sessionStorage.getItem('registeredDate');
    u.createdTimestamp=Number(sessionStorage.getItem('createdTimestamp'));
    u.createdDate=sessionStorage.getItem('createdDate');
    u.modifiedDate=sessionStorage.getItem('modifiedDate');
    u.modifiedTimestamp=Number(sessionStorage.getItem('modifiedTimestamp'));
    
    if(u.userRole!=null){
      this.isLoggedIn=true;
    }
    return u;
  }

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
              resolve({
                "userRole" : this.user.userRole,
                "status" : this.user.status
              });
            }
            
          })
        
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
    sessionStorage.setItem('createdTimestamp', this.user.createdTimestamp.toString());
    sessionStorage.setItem('createdDate', this.user.createdDate);
    sessionStorage.setItem('modifiedDate', this.user.modifiedTimestamp.toString());
    sessionStorage.setItem('modifiedTimestamp', this.user.modifiedDate);
    sessionStorage.setItem('registeredDate', this.user.registeredDate);
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
    sessionStorage.removeItem('createdTimestamp');
    sessionStorage.removeItem('createdDate');
    sessionStorage.removeItem('modifiedDate');
    sessionStorage.removeItem('modifiedTimestamp');
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
