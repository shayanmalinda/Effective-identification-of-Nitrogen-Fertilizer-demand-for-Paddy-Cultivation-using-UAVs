import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserReportsRequestsComponent } from './user-reports-requests.component';

describe('UserReportsRequestsComponent', () => {
  let component: UserReportsRequestsComponent;
  let fixture: ComponentFixture<UserReportsRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserReportsRequestsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserReportsRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
