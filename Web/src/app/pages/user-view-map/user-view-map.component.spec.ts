import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserViewMapComponent } from './user-view-map.component';

describe('UserViewMapComponent', () => {
  let component: UserViewMapComponent;
  let fixture: ComponentFixture<UserViewMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserViewMapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserViewMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
