import { Injectable } from '@angular/core';
import { FieldVisitTemp } from 'app/models/field-visit.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { FieldData } from 'app/models/field-data.model';
import { HttpClient } from '@angular/common/http';
import { ThrowStmt } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class FieldDataService {

  constructor(private fireStore : AngularFirestore, private http : HttpClient) { }

  

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

  getLevelFromServer(fd : FormData){
    // return this.http.post<number>('http://192.168.1.100:5000/process', fd);    //changed on 22nd march for dongle
    return this.http.post<number>('http://192.168.1.100:5000/svcprocess', fd);    //changed on 4th april for wifi
    // return this.http.post<number>('http://172.20.10.2:5000/process', fd);    //changed on 4th april for mobile phone data
  }

  getFieldDataUsingRequestId(fieldData : FieldData){
    return this.fireStore.collection('TestingFieldData', ref => ref.where('requestId', '==', fieldData.requestId)).snapshotChanges();
  }

  getAllFieldData(){
    return this.fireStore.collection('FieldData').snapshotChanges();
  }
}
