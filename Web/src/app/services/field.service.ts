import { User } from './../models/user.model';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Field } from '../models/field.model';

@Injectable({
  providedIn: 'root'
})
export class FieldService {
  fields: Field[];
  farmer: User;
  data: any;
  field: Field;


  constructor(private fireStore: AngularFirestore) { }

  getFields() {
    return this.fireStore.collection('FieldDetails').snapshotChanges();
  }
 
  getField(id: string) {
    return this.fireStore.collection('FieldDetails').doc(id).snapshotChanges()
  }

  deleteField(fieldId: String) {
    this.fireStore.doc('FieldDetails/' + fieldId).delete();
  }

  getFieldsByDivision(user : User) {
    // console.log("incoming division : " + user.division);
    // user.division = "Galle";
    return this.fireStore.collection('FieldDetails',ref => ref.where('division', '==', user.division)).snapshotChanges();
  }

}


