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
  getUserNamebyID(id:string){
    return this.fireStore.collection('Users').doc(id).snapshotChanges()
    // .subscribe(
    //             res => {
    //               this.user = { ...res.payload.data() as User };
    //               console.log('in user serv')
    //               console.log(this.user.firstName+" "+this.user.lastName);
    //               return this.user.firstName+" "+this.user.lastName;
    //             }
    //           )
  }

  getUser(userId:String){
    return this.fireStore.collection('Users', ref => ref.where('nic', '==', '867286151V')).get();
  }

  deleteUser(userId:String){
    console.log(userId);
    this.fireStore.doc('Users/' + userId).delete();  }

}


