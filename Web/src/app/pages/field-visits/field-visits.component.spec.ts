import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldVisitsComponent } from './field-visits.component';

describe('FieldVisitsComponent', () => {
  let component: FieldVisitsComponent;
  let fixture: ComponentFixture<FieldVisitsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FieldVisitsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FieldVisitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
