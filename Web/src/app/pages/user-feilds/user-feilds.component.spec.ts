import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserFeildsComponent } from './user-feilds.component';

describe('UserFeildsComponent', () => {
  let component: UserFeildsComponent;
  let fixture: ComponentFixture<UserFeildsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserFeildsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserFeildsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
