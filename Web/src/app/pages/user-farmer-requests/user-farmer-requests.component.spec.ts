import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserFarmerRequestsComponent } from './user-farmer-requests.component';

describe('UserFarmerRequestsComponent', () => {
  let component: UserFarmerRequestsComponent;
  let fixture: ComponentFixture<UserFarmerRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserFarmerRequestsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserFarmerRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
