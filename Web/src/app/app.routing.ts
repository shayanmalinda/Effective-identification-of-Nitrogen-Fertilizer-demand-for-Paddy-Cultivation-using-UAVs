import { AdminNLevelReportsComponent } from './pages/admin-n-level-reports/admin-n-level-reports.component';
import { DivisionReportsComponent } from './pages/division-reports/division-reports.component';
import { DivisionsComponent } from './pages/divisions/divisions.component';
import { FieldVisitsComponent } from './pages/field-visits/field-visits.component';
import { FieldVisitDetailsComponent } from './pages/field-visit-details/field-visit-details.component';
import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { SignupComponent } from './pages/signup/signup.component';
import { LoginComponent } from './pages/login/login.component';
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
import { LeftMenuComponent } from './left-menu/left-menu.component';



const routes: Routes =[
    // { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: '',            component: LoginComponent },
    { path: 'farmer-profile',     component: UserProfileComponent, canActivate: [AuthGuard] },
    { path: 'profile',          component: ProfileComponent, canActivate: [AuthGuard]},
    { path: 'signup',           component: SignupComponent },
    { path: 'login',            component: LoginComponent },
    { path: 'farmers',      component: UsersComponent, canActivate: [AuthGuard] },
    { path: 'updateuser',       component: UpdateProfileComponent, canActivate: [AuthGuard]},
    { path: 'fields',      component: FieldsComponent, canActivate: [AuthGuard] },
    { path: 'field-details',      component: FieldDetailsComponent, canActivate: [AuthGuard] },
    { path: 'agricultural-officers',      component: UsersComponent, canActivate: [AuthGuard] },
    { path: 'admin-dashboard',      component: AdminDashboardComponent, canActivate: [AuthGuard] },
    { path: 'admin-dashboard-reports',      component: AdminDashboardComponent, canActivate: [AuthGuard] },
    { path: 'requests',      component: UsersComponent, canActivate: [AuthGuard] },
    { path: 'officer-request',     component: UserProfileComponent, canActivate: [AuthGuard] },
    { path: 'officer-requests',     component: UsersComponent, canActivate: [AuthGuard] },
    { path: 'officers',     component: UsersComponent, canActivate : [AuthGuard]  },
    { path: 'admin-officers',     component: UsersComponent, canActivate: [AuthGuard]},
    { path: 'lcc-details',      component: LccDetailsComponent, canActivate: [AuthGuard]},
    { path: 'field-visits',      component: FieldVisitsComponent, canActivate: [AuthGuard]},
    { path: 'field-visit-details',      component: FieldVisitDetailsComponent, canActivate: [AuthGuard]},
    { path: 'user-dashboard',     component: UserDashboardComponent, canActivate: [AuthGuard]},
    { path: 'user-farmers',     component: UserFarmersComponent, canActivate: [AuthGuard]},
    { path: 'user-farmer-requests',     component: UserFarmerRequestsComponent, canActivate: [AuthGuard]},
    { path: 'user-fields',     component: UserFeildsComponent, canActivate: [AuthGuard]},
    { path: 'user-field-visits',     component: UserFieldVisitsComponent, canActivate: [AuthGuard]},
    { path: 'user-reports',     component: UserReportsComponent, canActivate: [AuthGuard]},
    { path: 'user-reports-farmers',     component: UserReportsFarmersComponent, canActivate : [AuthGuard] },
    { path: 'user-reports-fields',     component: UserReportsFieldsComponent, canActivate: [AuthGuard]},
    { path: 'user-reports-requests',     component: UserReportsRequestsComponent, canActivate : [AuthGuard] },
    { path: 'user-reports-visits',     component: UserReportsVisitsComponent, canActivate : [AuthGuard] },
    { path: 'user-field-history',     component: UserFieldHistoryComponent, canActivate: [AuthGuard]},
    { path: 'admin-profile',       component: UpdateProfileComponent, canActivate: [AuthGuard]},
    { path: 'divisions',       component: DivisionsComponent, canActivate: [AuthGuard]},
    { path: 'division-details',       component: DivisionsDetailsComponent, canActivate: [AuthGuard]},
    { path: 'user-upload-images',       component: MetaDataComponent, canActivate: [AuthGuard]},
    { path: 'user-view-map',       component: UserViewMapComponent, canActivate: [AuthGuard]},
    { path: 'field-visit-requests',      component: FieldVisitsComponent, canActivate: [AuthGuard]},
    { path: 'select-report',       component: DivisionsComponent, canActivate: [AuthGuard]},
    { path: 'division-report',       component: DivisionReportsComponent, canActivate: [AuthGuard]},
    { path: 'admin-farmer-reports',       component: AdminFarmerReportsComponent, canActivate: [AuthGuard]},
    { path: 'admin-officer-reports',       component: AdminFarmerReportsComponent, canActivate: [AuthGuard]},
    { path: 'admin-field-reports',       component: AdminFarmerReportsComponent, canActivate: [AuthGuard]},
    { path: 'admin-field-visit-req-reports',       component: AdminFieldVisitReqReportsComponent, canActivate: [AuthGuard]},
    { path: 'admin-field-visit-reports',       component: AdminFieldVisitReportsComponent, canActivate: [AuthGuard]},
    { path: 'admin-n-level-reports',       component: AdminNLevelReportsComponent, canActivate: [AuthGuard]},
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
