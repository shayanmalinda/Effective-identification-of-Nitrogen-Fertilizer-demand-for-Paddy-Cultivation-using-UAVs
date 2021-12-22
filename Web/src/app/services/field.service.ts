import { User } from './../models/user.model';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Field } from '../models/field.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FieldService {
  fields: Field[];
  farmer: User;
  data: any;
  field: Field;


  constructor(private fireStore: AngularFirestore) { }

  // getFields(): Observable<any> {
  //   return Observable.create(observer => {
  //     this.fireStore.collection('FieldDetails').snapshotChanges().subscribe(data => {

  //       data.map(e => {
  //         this.data = e.payload.doc.data() as Field;
  //         this.fireStore.collection('Users').doc(this.data.farmerId).snapshotChanges().subscribe(
  //           res => {
  //             this.farmer = { ...res.payload.data() as User };
  //             return {
  //               id: e.payload.doc.id,
  //               farmer: this.farmer.firstName + " " + this.farmer.lastName,
  //               ...e.payload.doc.data() as {}
  //             } as Field;
  //           }
  //         )
  //       })
  //     });
  //   });

  //   // return this.fields;


  // }
  getFields() {
    return this.fireStore.collection('FieldDetails').snapshotChanges();
 
  }
  getField(fieldId: String) {
    return this.fireStore.collection('FieldDetails', ref => ref.where('nic', '==', '867286151V')).get();
  }

  deleteField(fieldId: String) {
    console.log(fieldId);
    this.fireStore.doc('FieldDetails/' + fieldId).delete();
  }

}


