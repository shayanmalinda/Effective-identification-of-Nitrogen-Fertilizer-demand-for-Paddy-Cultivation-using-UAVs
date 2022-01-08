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

  getUsers(userRole, type) {
    if (userRole == 'officer')
      userRole = 'agricultural officer';

    if (type == 'request')
      return this.fireStore.collection('Users', ref => ref.where('userRole', '==', userRole).where('status', 'in', ['pending', 'declined'])).snapshotChanges();
    else
      return this.fireStore.collection('Users', ref => ref.where('userRole', '==', userRole).where('status', 'in', ['active', 'inactive'])).snapshotChanges();
  }

  getUser(id: string) {
    return this.fireStore.collection('Users').doc(id).snapshotChanges()
  }

  deleteUser(userId: String) {
    this.fireStore.doc('Users/' + userId).delete();
  }
  changeUserStatus(userId: string, status: String) {

    // if (status != 'inactive')
    this.fireStore.doc('Users/' + userId).update({ status: status });
    // else {

    // let fieldId: string;
    // this.fireStore.collection('FieldDetails', ref => ref.where('farmerId', '==', userId)).snapshotChanges().subscribe(data => {
    //   data.forEach(f => {
    //     fieldId = f.payload.doc.id;
    //   })
    // })
    
    // var batch = this.fireStore.firestore.batch();
    // var farmerRef = this.fireStore.firestore.collection("Users").doc(userId);
    // batch.update(farmerRef, { "status": status });

    // var fieldRef = this.fireStore.firestore.collection("FieldDetails").doc(fieldId);
    // batch.update(fieldRef, { "status": status });

    // return batch.commit()

    // }

  }
  changeuserActivation(userId: string, fieldId: string, status: String) {

    if (status != 'inactive')
      this.fireStore.doc('Users/' + userId).update({ status: status });
    else {

      // let fieldId: string;
      // this.fireStore.collection('FieldDetails', ref => ref.where('farmerId', '==', userId)).snapshotChanges().subscribe(data => {
      //   data.forEach(f => {
      //     fieldId = f.payload.doc.id;
      //   })
      // })
      // var batch = this.fireStore.firestore.batch();
      // var farmerRef = this.fireStore.firestore.collection("Users").doc(userId);
      // batch.update(farmerRef, { "status": status });

      // var fieldRef = this.fireStore.firestore.collection("FieldDetails").doc(fieldId);
      // batch.update(fieldRef, { "status": status });

      // return batch.commit()
      console.log(userId)
      console.log(fieldId)

      var batch = this.fireStore.firestore.batch();
      var farmerRef = this.fireStore.firestore.collection("Users").doc(userId);
      batch.update(farmerRef, { "status": status });

      var fieldRef = this.fireStore.firestore.collection("FieldDetails").doc(fieldId);
      batch.update(fieldRef, { "status": status });

      return batch.commit()
    }

  }
  // acceptUser(userId: String) {
  //   this.fireStore.doc('Users/' + userId).update({ status: 'approved' });
  // }
  // declineUser(userId: String) {
  //   this.fireStore.doc('Users/' + userId).update({ status: 'declined' });
  // }
  // deUser(userId: String) {
  //   this.fireStore.doc('Users/' + userId).update({ status: 'declined' });
  // }

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

  getFarmerById(userCredential: UserCredential) {
    console.log(userCredential.userID);
    // return this.fireStore.collection('Users').doc(userCredential.userID).get();
    return this.fireStore.collection('Users').doc(userCredential.userID).snapshotChanges()
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

  updateUserDetails(id: String, user: User) {
    return new Promise<any>((resolve, reject) => {
      this.fireStore.collection('Users').doc('' + id + '').update(user)
        .then(
          res => {
            resolve("Success");
          }
          , err => reject(err.message))
    })

  }

}


