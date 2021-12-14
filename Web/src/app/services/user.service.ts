import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from '../models/user.model';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private firestore: AngularFirestore) { }

  getUsers() {
    return this.firestore.collection('Users').snapshotChanges();
  }

}


