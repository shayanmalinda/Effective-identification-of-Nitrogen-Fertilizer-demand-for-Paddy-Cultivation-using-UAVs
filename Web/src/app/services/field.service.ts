import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Field } from '../models/field.model';

@Injectable({
  providedIn: 'root'
})
export class FieldService {


  constructor(private fireStore: AngularFirestore) { }

  getFields() {
    return this.fireStore.collection('FieldDetails').snapshotChanges();
    
  }

  getField(fieldId:String){
    return this.fireStore.collection('FieldDetails', ref => ref.where('nic', '==', '867286151V')).get();
  }

  deleteField(fieldId:String){
    console.log(fieldId);
    this.fireStore.doc('FieldDetails/' + fieldId).delete();  }

}


