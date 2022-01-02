import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app.routing';
import { DatePipe } from '@angular/common';

import { AppComponent } from './app.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';

import { ComponentsModule } from './components/components.module';
import { ExamplesModule } from './pages/examples.module';
import { LoginComponent } from './pages/login/login.component';
// import { UsersComponent } from './pages/users/users.component';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { LccDetailsComponent } from './pages/lcc-details/lcc-details.component';
import { UserDashboardComponent } from './pages/user-dashboard/user-dashboard.component';
import { ShowMessageComponent } from './show-message/show-message.component';
import { UserFarmersComponent } from './pages/user-farmers/user-farmers.component';
import { UserFarmerRequestsComponent } from './pages/user-farmer-requests/user-farmer-requests.component';
import { UserFeildsComponent } from './pages/user-feilds/user-feilds.component';
import { UserFieldVisitsComponent } from './pages/user-field-visits/user-field-visits.component';
import { DetailsFormComponent } from './details-form/details-form.component';

// Firebase
import { AngularFireModule } from '@angular/fire';
import { environment } from '../environments/environment';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { UpdateProfileComponent } from './pages/update-profile/update-profile.component';

//material
import { MaterialModule } from './material/material.module';

//route authentication
import { AuthGuard } from './services/auth/auth.guard';
import { AgmCoreModule } from '@agm/core';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    LoginComponent,
    UserProfileComponent,
    UpdateProfileComponent,
    ShowMessageComponent,
    LccDetailsComponent,
    UserDashboardComponent,
    UserFarmersComponent,
    UserFarmerRequestsComponent,
    UserFeildsComponent,
    UserFieldVisitsComponent,
    DetailsFormComponent,
    
  ],
  imports: [
    BrowserModule,
    NgbModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    RouterModule,
    ComponentsModule,
    ExamplesModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig, 'smart-rice-care'),
    AngularFirestoreModule, // Only required for database features
    AngularFireAuthModule, // Only required for auth features,
    AngularFireStorageModule, NoopAnimationsModule, // Only required for storage features
    AgmCoreModule.forRoot({
      apiKey : 'AIzaSyBQz_TZCNa04wVSBLTggZ-G8XWR3A2bFbc',
      // libraries: ['places']
    })
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent],
  entryComponents:[ShowMessageComponent],
})
export class AppModule { }
