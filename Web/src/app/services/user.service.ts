import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from '../models/user.model';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  user: User;

  constructor(private fireStore: AngularFirestore) { }

  getUsers(userRole, status) {
    // console.log(userRole+"mmm"+status);
    if (userRole == 'user')
      userRole = 'farmer'
    else
      userRole = 'agricultural officer'
    return this.fireStore.collection('Users', ref => ref.where('userRole', '==', userRole).where('status', '==', status)).snapshotChanges();
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

}


