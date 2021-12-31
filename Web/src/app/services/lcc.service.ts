import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { LCCMainDetails, LCCWeekDetails } from 'app/models/lcc.model';

@Injectable({
  providedIn: 'root'
})
export class LccService {

  constructor(private fireStore: AngularFirestore) { }

  saveLccDetails(lccMainDetails : LCCMainDetails){
    return new Promise<any>((resolve, reject) => {
      this.fireStore.collection('LCCDetails').doc().set(lccMainDetails)
    .then(
      res => {
      resolve("Success");
    }
      ,err => reject(err.message))
    })
  }
}
