import { Injectable } from '@angular/core';
import { FieldVisitTemp } from 'app/models/field-visit.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { FieldData } from 'app/models/field-data.model';

@Injectable({
  providedIn: 'root'
})
export class FieldDataService {

  constructor(private fireStore : AngularFirestore) { }

  getFieldData(fieldData: FieldData) {
    // console.log(fieldVisitTemp.fieldId);
    return this.fireStore.collection('TestingFieldData', ref => ref.where('longitude', '==', fieldData.longitude).where('latitude', '==' , fieldData.latitude).where('requestId', '==', fieldData.requestId)).snapshotChanges();
  }

  insertFieldData(fieldData : FieldData){
    // return this.fireStore.collection('TestingFieldData').add(fieldData);
    return new Promise<any>((resolve, reject) => {
      this.fireStore.collection('TestingFieldData').add(fieldData)
        .then(
          res => {
            resolve("Success");
          }
          , err => reject(err.message))
    })
  }
}
