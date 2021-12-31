import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { LCCMainDetails, LCCWeekDetails } from 'app/models/lcc.model';
import { User } from 'app/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class LccService {

  constructor(private fireStore: AngularFirestore) { }

  saveLccDetails(lccMainDetails : LCCMainDetails, havePreviousRecords : boolean){
    return new Promise<any>((resolve, reject) => {
      if(havePreviousRecords == false){
        this.fireStore.collection('LCCDetails').add(lccMainDetails)
        .then(
          res => {
            resolve('success');
          },
          err => reject(err.message)
        )
      }else{
        var lccId = sessionStorage.getItem('LCCID');
        this.fireStore.collection('LCCDetails').doc(''+ lccId +'').update(lccMainDetails)
        .then(
          res => {
            resolve('success');
          },
          err => reject(err.message)
        )
      }
    })
  }

  getLccDetailsByDivision(user : User) {
    return this.fireStore.collection('LCCDetails', ref => ref.where('division', '==', user.division)).get();
  }
}
