import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { UrlSegment } from '@angular/router';
import { User, UserCredential } from '../models/user.model';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  user: User;

  constructor(private fireStore: AngularFirestore) { }

  getUsers(userRole, status) {
    if (userRole == 'officer')
      userRole = 'agricultural officer'
    console.log(userRole + "maSEmm" + status);

    if (status == 'approved')
      return this.fireStore.collection('Users', ref => ref.where('userRole', '==', userRole).where('status', '==', status)).snapshotChanges();
    else return this.fireStore.collection('Users', ref => ref.where('userRole', '==', userRole).where('status', 'in', ['pending', 'declined'])).snapshotChanges();

  }

  getUser(id: string) {
    return this.fireStore.collection('Users').doc(id).snapshotChanges()
  }

  deleteUser(userId: String) {
    this.fireStore.doc('Users/' + userId).delete();
  }
  acceptUser(userId: String) {
    this.fireStore.doc('Users/' + userId).update({ status: 'approved' });
  }
  declineUser(userId: String) {
    this.fireStore.doc('Users/' + userId).update({ status: 'declined' });
  }

  getallUsers() {
    return this.fireStore.collection('Users').get();
  }

  addUser(userCredential: UserCredential, user: User) {
    this.fireStore.collection('Users').doc('' + userCredential.userID + '').set(user);
  }

  getUserByEmail(userCredential: UserCredential) {
    // console.log(user.email + " " + user.password );
    return this.fireStore.collection('Users', ref => ref.where('email', '==', userCredential.email)).get();
  }

  // saveUserDetails(userCredential : UserCredential, user : User){
  //   this.fireStore.collection('Users').doc(''+ userCredential.userID +'').update(user);
  // }

  saveUserDetails(userCredential: UserCredential, user: User) {
    return new Promise<any>((resolve, reject) => {
      this.fireStore.collection('Users').doc('' + userCredential.userID + '').update(user)
        .then(
          res => {
            resolve("Success");
          }
          , err => reject(err.message))
    })

  }

}


