import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminFieldVisitReqReportsComponent } from './admin-field-visit-reports.component';

describe('AdminFieldVisitReqReportsComponent', () => {
  let component: AdminFieldVisitReqReportsComponent;
  let fixture: ComponentFixture<AdminFieldVisitReqReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminFieldVisitReqReportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminFieldVisitReqReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
