import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserFieldVisitsComponent } from './user-field-visits.component';

describe('UserFieldVisitsComponent', () => {
  let component: UserFieldVisitsComponent;
  let fixture: ComponentFixture<UserFieldVisitsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserFieldVisitsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserFieldVisitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
