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
import { LccDetailsComponent } from './pages/lcc-details/lcc-details.component';
import { UserDashboardComponent } from './pages/user-dashboard/user-dashboard.component';
import { AuthGuard } from './services/auth/auth.guard';
import { UserFarmersComponent } from './pages/user-farmers/user-farmers.component';
import { UserFarmerRequestsComponent } from './pages/user-farmer-requests/user-farmer-requests.component';
import { UserFeildsComponent } from './pages/user-feilds/user-feilds.component';
import { UserFieldVisitsComponent } from './pages/user-field-visits/user-field-visits.component';
import { UserReportsComponent } from './pages/user-reports/user-reports.component';



const routes: Routes =[
    // { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home',             component: ComponentsComponent },
    { path: 'farmer-profile',     component: UserProfileComponent },
    { path: 'profile',          component: ProfileComponent, canActivate : [AuthGuard] },
    { path: 'signup',           component: SignupComponent },
    { path: 'login',            component: LoginComponent },
    { path: 'landing',          component: LandingComponent },
    { path: 'nucleoicons',      component: NucleoiconsComponent },
    { path: 'farmers',      component: UsersComponent },
    { path: 'updateuser',       component: UpdateProfileComponent, canActivate : [AuthGuard] },
    { path: 'fields',      component: FieldsComponent },
    { path: 'field-details',      component: FieldDetailsComponent },
    { path: 'agricultural-officers',      component: UsersComponent },
    { path: 'admin-dashboard',      component: AdminDashboardComponent },
    { path: 'requests',      component: UsersComponent },
    { path: 'farmer-request',     component: UserProfileComponent },
    { path: 'officer-requests',     component: UsersComponent },
    { path: 'officers',     component: UsersComponent },
    { path: 'lcc-details',      component: LccDetailsComponent, canActivate : [AuthGuard] },
    { path: 'field-visits',      component: FieldVisitsComponent},
    { path: 'field-visit-details',      component: FieldVisitDetailsComponent},
    { path: 'user-dashboard',     component: UserDashboardComponent},
    { path: 'user-farmers',     component: UserFarmersComponent, canActivate : [AuthGuard]  },
    { path: 'user-farmer-requests',     component: UserFarmerRequestsComponent},
    { path: 'user-fields',     component: UserFeildsComponent, canActivate : [AuthGuard]  },
    { path: 'user-field-visits',     component: UserFieldVisitsComponent,},
    { path: 'user-reports',     component: UserReportsComponent},
    { path: 'admin-profile',       component: UpdateProfileComponent, canActivate : [AuthGuard] },







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
