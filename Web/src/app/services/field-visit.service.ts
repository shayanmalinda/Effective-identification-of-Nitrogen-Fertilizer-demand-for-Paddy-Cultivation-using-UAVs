import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FieldVisitService {
  
  constructor(private fireStore: AngularFirestore) { }

  getFieldVisitRequests(fieldId: String) {
    return this.fireStore.collection('FieldRequests', ref => ref.where('fieldId', '==', fieldId)).valueChanges();
  }
  getFieldVisitCountsByStatus(fieldId: String) {
    let counts:any[]=[];
    this.fireStore.collection('FieldRequests', ref => ref.where('fieldId', '==', fieldId)
      .where('status', '==', 'pending')).valueChanges().subscribe(data => {
        if (data.length != 0)
          counts.push({
            status: "Pending",
            count: data.length,
          });
      });
    this.fireStore.collection('FieldRequests', ref => ref.where('fieldId', '==', fieldId)
      .where('status', '==', 'processing')).valueChanges().subscribe(data => {
        if (data.length != 0)
          counts.push({
            status: "Processing",
            count: data.length,
          });
      });
    this.fireStore.collection('FieldRequests', ref => ref.where('fieldId', '==', fieldId)
      .where('status', '==', 'completed')).valueChanges().subscribe(data => {
        if (data.length != 0)
          counts.push({
            status: "Completed",
            count: data.length,
          });
      });
    return counts;
  }

  getFieldVisits() {
    return this.fireStore.collection('FieldRequests').snapshotChanges();
  }
 

  deleteFieldVisit(fieldVisitId: String) {
    this.fireStore.doc('FieldRequests/' + fieldVisitId).delete();
  }

}



