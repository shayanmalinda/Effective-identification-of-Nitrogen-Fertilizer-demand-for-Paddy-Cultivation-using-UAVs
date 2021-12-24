import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from '../models/user.model';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  user:User;

  constructor(private fireStore: AngularFirestore) { }

  getUsers() {
    return this.fireStore.collection('Users').snapshotChanges();
    
  }
  getUser(id:string){
    return this.fireStore.collection('Users').doc(id).snapshotChanges()
  }

  

  deleteUser(userId:String){
    console.log(userId);
    this.fireStore.doc('Users/' + userId).delete();  }

}


