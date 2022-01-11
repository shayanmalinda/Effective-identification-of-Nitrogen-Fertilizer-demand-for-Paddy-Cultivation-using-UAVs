import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserFieldHistoryComponent } from './user-field-history.component';

describe('UserFieldHistoryComponent', () => {
  let component: UserFieldHistoryComponent;
  let fixture: ComponentFixture<UserFieldHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserFieldHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserFieldHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
