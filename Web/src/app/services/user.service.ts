import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { UrlSegment } from '@angular/router';
import { User, UserCredential } from '../models/user.model';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private fireStore: AngularFirestore) { }

  getUsers() {
    return this.fireStore.collection('Users').snapshotChanges();
  }

  getUser(userId:String){
    return this.fireStore.collection('Users', ref => ref.where('nic', '==', '867286151V')).get();
  }

  getallUsers(){
    return this.fireStore.collection('Users').get();
  }

  addUser(userCredential : UserCredential, user : User){
    this.fireStore.collection('Users').doc(''+ userCredential.userID +'').set(user);
  }

  getUserByEmail(userCredential : UserCredential){
    // console.log(user.email + " " + user.password );
    return this.fireStore.collection('Users', ref => ref.where('email', '==', userCredential.email)).get();
  }

  // saveUserDetails(userCredential : UserCredential, user : User){
  //   this.fireStore.collection('Users').doc(''+ userCredential.userID +'').update(user);
  // }

  saveUserDetails(userCredential : UserCredential, user : User){
    return new Promise<any>((resolve, reject) => {
      this.fireStore.collection('Users').doc(''+ userCredential.userID +'').update(user)
    .then(
      res => {
      resolve("Success");
    }
      ,err => reject(err.message))
    })
    
  }

}


