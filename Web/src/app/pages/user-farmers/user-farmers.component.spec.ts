import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserFarmersComponent } from './user-farmers.component';

describe('UserFarmersComponent', () => {
  let component: UserFarmersComponent;
  let fixture: ComponentFixture<UserFarmersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserFarmersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserFarmersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
