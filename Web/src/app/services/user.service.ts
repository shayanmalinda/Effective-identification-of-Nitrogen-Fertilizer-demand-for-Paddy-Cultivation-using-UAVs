import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from '../models/user.model';


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

  deleteUser(userId:String){
    console.log(userId);
    this.fireStore.doc('Users/' + userId).delete();  }

}


