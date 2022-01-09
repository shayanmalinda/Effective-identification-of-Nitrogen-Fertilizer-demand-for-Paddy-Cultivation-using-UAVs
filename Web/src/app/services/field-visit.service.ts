import { _isNumberValue } from '@angular/cdk/coercion';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FieldVisit, FieldVisitTemp } from 'app/models/field-visit.model';
import { User } from 'app/models/user.model';
import { distinctUntilChanged } from 'rxjs-compat/operator/distinctUntilChanged';
import { skip } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FieldVisitService {

  constructor(private fireStore: AngularFirestore) { }

  getFieldVisitRequests(fieldId: String) {
    return this.fireStore.collection('FieldRequests', ref => ref.where('fieldId', '==', fieldId)).valueChanges();
  }
  // getFieldVisitCountsByStatus(fieldId: String) {
  //   let countsTemp: any[] = [];
  //   let counts: { [key: string]: number } = {
  //     pending: 0,
  //     confirmed: 0,
  //     declined: 0,
  //     processing: 0,
  //     completed: 0,
  //   }
  //   let fieldvisits: FieldVisit[];
  //   this.fireStore.collection('FieldRequests', ref => ref.where('fieldId', '==', fieldId)
  //   ).valueChanges().subscribe(data => {
  //     fieldvisits = data.map(a => {
  //       return {
  //         ...a as FieldVisit
  //       }
  //     })
  //     // console.log(fieldvisits)
  //     fieldvisits.forEach(visit => {
  //       counts[visit.status]++;
  //     })
  //     // console.log(counts)
  //     Object.keys(counts).forEach(key => {
  //       if (counts[key] != 0)
  //         countsTemp.push({
  //           status: key,
  //           counts: counts[key]
  //         })
  //       console.log("serv")
  //     });
  //     return countsTemp;


  //   });


  // }

  getFieldVisits(fieldId) {
    if (fieldId == "all")
      return this.fireStore.collection('FieldRequests').snapshotChanges();
    else
      return this.fireStore.collection('FieldRequests', ref => ref.where('fieldId', '==', fieldId)).snapshotChanges();

  }

  getFieldVisitsByDivision(user: User) {
    return this.fireStore.collection('FieldRequests', ref => ref.where('division', '==', user.division)).snapshotChanges();
  }

  getFieldVisitsByFieldID(fieldVisitTemp: FieldVisitTemp) {
    // console.log(fieldVisitTemp.fieldId);
    return this.fireStore.collection('FieldRequests', ref => ref.where('fieldId', '==', fieldVisitTemp.fieldId)).snapshotChanges();
  }

  deleteFieldVisit(fieldVisitId: String) {
    this.fireStore.doc('FieldRequests/' + fieldVisitId).delete();
  }

  updateFieldVisitStatus(fieldVisitTemp: FieldVisitTemp) {
    console.log("the temp in the service file : " + fieldVisitTemp);
    return new Promise<any>((resolve, reject) => {
      this.fireStore.collection('FieldRequests').doc('' + fieldVisitTemp.id + '').update({'status' : fieldVisitTemp.status, 'modifiedDate' : fieldVisitTemp.modifiedDate, 'modifiedTimestamp' : fieldVisitTemp.modifiedTimestamp, 'note' : fieldVisitTemp.note, 'visitDate' : fieldVisitTemp.visitDate})
        .then(
          res => {
            resolve("Success");
          }
          , err => reject(err.message))
    })

  }

}



