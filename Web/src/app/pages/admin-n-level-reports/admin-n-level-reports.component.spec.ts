import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminNLevelReportsComponent } from './admin-n-level-reports.component';

describe('AdminNLevelReportsComponent', () => {
  let component: AdminNLevelReportsComponent;
  let fixture: ComponentFixture<AdminNLevelReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminNLevelReportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminNLevelReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
