import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserReportsVisitsComponent } from './user-reports-visits.component';

describe('UserReportsVisitsComponent', () => {
  let component: UserReportsVisitsComponent;
  let fixture: ComponentFixture<UserReportsVisitsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserReportsVisitsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserReportsVisitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
