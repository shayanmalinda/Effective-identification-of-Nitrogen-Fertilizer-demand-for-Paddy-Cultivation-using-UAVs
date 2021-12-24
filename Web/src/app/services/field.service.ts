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
 

  deleteField(fieldId: String) {
    this.fireStore.doc('FieldDetails/' + fieldId).delete();
  }

}


