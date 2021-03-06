import { AdminNLevelReportsComponent } from './pages/admin-n-level-reports/admin-n-level-reports.component';
import { DivisionReportsComponent } from './pages/division-reports/division-reports.component';
import { DivisionsComponent } from './pages/divisions/divisions.component';
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
import { UserFieldHistoryComponent } from './pages/user-field-history/user-field-history.component';
import { DivisionsDetailsComponent } from './pages/division-details/division-details.component';
import { MetaDataComponent } from './meta-data/meta-data.component';
import { UserViewMapComponent } from './pages/user-view-map/user-view-map.component';
import { UserReportsFarmersComponent } from './pages/user-reports-farmers/user-reports-farmers.component';
import { UserReportsFieldsComponent } from './pages/user-reports-fields/user-reports-fields.component';
import { UserReportsRequestsComponent } from './pages/user-reports-requests/user-reports-requests.component';
import { UserReportsVisitsComponent } from './pages/user-reports-visits/user-reports-visits.component';
import { AdminFarmerReportsComponent } from './pages/admin-farmer-reports/admin-farmer-reports-farmers.component';
import { AdminFieldVisitReportsComponent } from './pages/admin-field-visit-reports/admin-field-visit-reports.component';
import { AdminFieldVisitReqReportsComponent } from './pages/admin-field-visit-req-reports/admin-field-visit-req-reports.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';



const routes: Routes =[
    // { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: '',            component: LoginComponent },
    { path: 'farmer-profile',     component: UserProfileComponent },
    { path: 'profile',          component: ProfileComponent},
    { path: 'signup',           component: SignupComponent },
    { path: 'login',            component: LoginComponent },
    { path: 'nucleoicons',      component: NucleoiconsComponent },
    { path: 'farmers',      component: UsersComponent },
    { path: 'updateuser',       component: UpdateProfileComponent},
    { path: 'fields',      component: FieldsComponent },
    { path: 'field-details',      component: FieldDetailsComponent },
    { path: 'agricultural-officers',      component: UsersComponent },
    { path: 'admin-dashboard',      component: AdminDashboardComponent },
    { path: 'admin-dashboard-reports',      component: AdminDashboardComponent },
    { path: 'requests',      component: UsersComponent },
    { path: 'officer-request',     component: UserProfileComponent },
    { path: 'officer-requests',     component: UsersComponent },
    { path: 'officers',     component: UsersComponent, canActivate : [AuthGuard]  },
    { path: 'admin-officers',     component: UsersComponent},
    { path: 'lcc-details',      component: LccDetailsComponent},
    { path: 'field-visits',      component: FieldVisitsComponent},
    { path: 'field-visit-details',      component: FieldVisitDetailsComponent},
    { path: 'user-dashboard',     component: UserDashboardComponent},
    { path: 'user-farmers',     component: UserFarmersComponent},
    { path: 'user-farmer-requests',     component: UserFarmerRequestsComponent},
    { path: 'user-fields',     component: UserFeildsComponent},
    { path: 'user-field-visits',     component: UserFieldVisitsComponent,},
    { path: 'user-reports',     component: UserReportsComponent},
    { path: 'user-reports-farmers',     component: UserReportsFarmersComponent, canActivate : [AuthGuard] },
    { path: 'user-reports-fields',     component: UserReportsFieldsComponent},
    { path: 'user-reports-requests',     component: UserReportsRequestsComponent, canActivate : [AuthGuard] },
    { path: 'user-reports-visits',     component: UserReportsVisitsComponent, canActivate : [AuthGuard] },
    { path: 'user-field-history',     component: UserFieldHistoryComponent,},
    { path: 'admin-profile',       component: UpdateProfileComponent},
    { path: 'divisions',       component: DivisionsComponent},
    { path: 'division-details',       component: DivisionsDetailsComponent},
    { path: 'user-upload-images',       component: MetaDataComponent},
    { path: 'user-view-map',       component: UserViewMapComponent},
    { path: 'field-visit-requests',      component: FieldVisitsComponent},
    { path: 'select-report',       component: DivisionsComponent},
    { path: 'division-report',       component: DivisionReportsComponent},
    { path: 'admin-farmer-reports',       component: AdminFarmerReportsComponent},
    { path: 'admin-officer-reports',       component: AdminFarmerReportsComponent},
    { path: 'admin-field-reports',       component: AdminFarmerReportsComponent},
    { path: 'admin-field-visit-req-reports',       component: AdminFieldVisitReqReportsComponent},
    { path: 'admin-field-visit-reports',       component: AdminFieldVisitReportsComponent},
    { path: 'admin-n-level-reports',       component: AdminNLevelReportsComponent},
    { path: '**', pathMatch: 'full', component: NotFoundComponent },

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
