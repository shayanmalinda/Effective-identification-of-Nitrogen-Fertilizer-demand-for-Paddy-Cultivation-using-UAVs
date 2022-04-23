import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { LandingComponent } from './landing/landing.component';
import { ProfileComponent } from './profile/profile.component';
import { SignupComponent } from './signup/signup.component';
import { UsersComponent } from './users/users.component';

//material
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRippleModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table'
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatTableExporterModule } from 'mat-table-exporter';

import { FieldsComponent } from './fields/fields.component';
import { FieldDetailsComponent } from './field-details/field-details.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FieldVisitsComponent } from './field-visits/field-visits.component';
import { FieldVisitDetailsComponent } from './field-visit-details/field-visit-details.component';
import { DivisionsComponent } from './divisions/divisions.component';
import { DivisionsDetailsComponent } from './division-details/division-details.component';
import { UserReportsFarmersComponent } from './user-reports-farmers/user-reports-farmers.component';
import { UserReportsFieldsComponent } from './user-reports-fields/user-reports-fields.component';
import { UserReportsVisitsComponent } from './user-reports-visits/user-reports-visits.component';
import { UserReportsRequestsComponent } from './user-reports-requests/user-reports-requests.component';
import { DivisionReportsComponent } from './division-reports/division-reports.component';
import { AdminFarmerReportsComponent } from './admin-farmer-reports/admin-farmer-reports-farmers.component';
import { AdminFieldVisitReportsComponent } from './admin-field-visit-reports/admin-field-visit-reports.component';
import { AdminFieldVisitReqReportsComponent } from './admin-field-visit-req-reports/admin-field-visit-req-reports.component';
import {MatCardModule} from '@angular/material/card';
import { ChartsModule } from 'ng2-charts';
import { NotFoundComponent } from './not-found/not-found.component';



@NgModule({
    imports: [    
        CommonModule,
        FormsModule,
        NgbModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatFormFieldModule,
        MatInputModule,
        MatRippleModule,
        MatTableModule,
        MatSortModule,
        MatPaginatorModule,
        MatIconModule,
        MatTableExporterModule,
        MatCardModule,
        ChartsModule,

    ],
    declarations: [
        LandingComponent,
        SignupComponent,
        ProfileComponent,
        UsersComponent,
        FieldsComponent,
        FieldDetailsComponent,
        AdminDashboardComponent,
        FieldVisitsComponent,
        FieldVisitDetailsComponent,
        DivisionsComponent,
        DivisionsDetailsComponent,
        UserReportsFarmersComponent,
        UserReportsFieldsComponent,
        UserReportsVisitsComponent,
        UserReportsRequestsComponent,
        DivisionReportsComponent,
        AdminFarmerReportsComponent,
        AdminFieldVisitReportsComponent,
        AdminFieldVisitReqReportsComponent
        NotFoundComponent
    ]
})
export class ExamplesModule { }
