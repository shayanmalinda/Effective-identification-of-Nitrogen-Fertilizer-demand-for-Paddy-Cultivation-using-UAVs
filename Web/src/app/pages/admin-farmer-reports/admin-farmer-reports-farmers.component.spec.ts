import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminFarmerReportsComponent } from './admin-farmer-reports-farmers.component';

describe('AdminFarmerReportsComponent', () => {
  let component: AdminFarmerReportsComponent;
  let fixture: ComponentFixture<AdminFarmerReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminFarmerReportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminFarmerReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
