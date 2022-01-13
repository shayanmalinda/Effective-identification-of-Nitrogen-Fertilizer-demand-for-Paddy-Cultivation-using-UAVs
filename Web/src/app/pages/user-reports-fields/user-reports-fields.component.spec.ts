import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserReportsFieldsComponent } from './user-reports-fields.component';

describe('UserReportsFieldsComponent', () => {
  let component: UserReportsFieldsComponent;
  let fixture: ComponentFixture<UserReportsFieldsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserReportsFieldsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserReportsFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
