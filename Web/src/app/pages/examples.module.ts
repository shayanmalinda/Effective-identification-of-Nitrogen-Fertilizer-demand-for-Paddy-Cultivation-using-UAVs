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
import { FieldsComponent } from './fields/fields.component';
import { FieldDetailsComponent } from './field-details/field-details.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FieldVisitsComponent } from './field-visits/field-visits.component';
import { FieldVisitDetailsComponent } from './field-visit-details/field-visit-details.component';
import { DivisionsComponent } from './divisions/divisions.component';
import { DivisionsDetailsComponent } from './division-details/division-details.component';
import { DivisionReportsComponent } from './division-reports/division-reports.component';

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
        MatIconModule
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
        DivisionReportsComponent

    ]
})
export class ExamplesModule { }
