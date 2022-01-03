import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { LCCMainDetails, LCCWeekDetails } from 'app/models/lcc.model';
import { User, UserCredential } from 'app/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserFarmersService {

  constructor(private fireStore: AngularFirestore) { }

  //to get all farmers by using division
  getAllFarmersByDivion(user) {
    console.log("try to get all farmers using the division : " + user.division);
    return this.fireStore.collection('Users', ref => ref.where('userRole', '==', 'farmer').where('division', '==', user.division)).snapshotChanges();
  }

  //get farmer by ID
  getFarmerById(userCredential : UserCredential){
    console.log(userCredential.userID);
    // return this.fireStore.collection('Users').doc(userCredential.userID).get();
    return this.fireStore.collection('Users').doc(userCredential.userID).snapshotChanges()
  }
}
