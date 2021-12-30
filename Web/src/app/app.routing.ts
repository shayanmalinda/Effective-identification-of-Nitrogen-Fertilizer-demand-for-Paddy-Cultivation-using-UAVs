import { FieldVisitsComponent } from './pages/field-visits/field-visits.component';
import { FieldVisitDetailsComponent } from './pages/field-visit-details/field-visit-details.component';
import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';
import { ComponentsComponent } from './components/components.component';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { SignupComponent } from './pages/signup/signup.component';
import { LoginComponent } from './pages/login/login.component';
import { LandingComponent } from './pages/landing/landing.component';
import { NucleoiconsComponent } from './components/nucleoicons/nucleoicons.component';
import { UsersComponent } from './pages/users/users.component';
import { UpdateProfileComponent } from './pages/update-profile/update-profile.component';
import { FieldsComponent } from './pages/fields/fields.component';
import { FieldDetailsComponent } from './pages/field-details/field-details.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';



const routes: Routes =[
    // { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home',             component: ComponentsComponent },
    { path: 'user-profile',     component: UserProfileComponent },
    { path: 'profile',          component: ProfileComponent },
    { path: 'signup',           component: SignupComponent },
    { path: 'login',            component: LoginComponent },
    { path: 'landing',          component: LandingComponent },
    { path: 'nucleoicons',      component: NucleoiconsComponent },
    { path: 'users',      component: UsersComponent },
    { path: 'updateuser',       component: UpdateProfileComponent },
    { path: 'fields',      component: FieldsComponent },
    { path: 'field-details',      component: FieldDetailsComponent },
    { path: 'agricultural-officers',      component: UsersComponent },
    { path: 'admin-dashboard',      component: AdminDashboardComponent },
    { path: 'requests',      component: UsersComponent },
    { path: 'user-request',     component: UserProfileComponent },
    { path: 'officer-requests',     component: UsersComponent },
    { path: 'officers',     component: UsersComponent },
    { path: 'field-visits',      component: FieldVisitsComponent },
    { path: 'field-visit-details',      component: FieldVisitDetailsComponent },







];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes,{
      useHash: false
    })
  ],
  exports: [
  ],
})
export class AppRoutingModule { }
