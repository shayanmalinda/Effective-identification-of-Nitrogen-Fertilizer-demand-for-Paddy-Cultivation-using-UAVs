import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app.routing';

import { AppComponent } from './app.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';

import { ComponentsModule } from './components/components.module';
import { ExamplesModule } from './pages/examples.module';
import { LoginComponent } from './login/login.component';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';

// Firebase
import { AngularFireModule } from '@angular/fire';
import { environment } from '../environments/environment';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireStorageModule } from '@angular/fire/storage';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    LoginComponent,
    UserProfileComponent
  ],
  imports: [
    BrowserModule,
    NgbModule,
    FormsModule,
    RouterModule,
    ComponentsModule,
    ExamplesModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig, 'mytestapp'),
AngularFirestoreModule, // Only required for database features
AngularFireAuthModule, // Only required for auth features,
AngularFireStorageModule // Only required for storage features
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
