import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserReportsFarmersComponent } from './user-reports-farmers.component';

describe('UserReportsFarmersComponent', () => {
  let component: UserReportsFarmersComponent;
  let fixture: ComponentFixture<UserReportsFarmersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserReportsFarmersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserReportsFarmersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
