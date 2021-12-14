import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})

export class ProfileComponent implements OnInit {

    constructor(private db: AngularFirestore) {
        const things = db.collection('Users').valueChanges();
        things.subscribe(console.log);
    }

    ngOnInit() {}

}
