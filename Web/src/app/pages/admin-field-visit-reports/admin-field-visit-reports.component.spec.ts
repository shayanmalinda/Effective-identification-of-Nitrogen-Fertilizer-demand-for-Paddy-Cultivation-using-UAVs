import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminFieldVisitReportsComponent } from './admin-field-visit-reports.component';

describe('AdminFieldVisitReportsComponent', () => {
  let component: AdminFieldVisitReportsComponent;
  let fixture: ComponentFixture<AdminFieldVisitReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminFieldVisitReportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminFieldVisitReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
