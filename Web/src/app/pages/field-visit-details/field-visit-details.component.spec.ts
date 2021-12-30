import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldVisitDetailsComponent } from './field-visit-details.component';

describe('FieldVisitDetailsComponent', () => {
  let component: FieldVisitDetailsComponent;
  let fixture: ComponentFixture<FieldVisitDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FieldVisitDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FieldVisitDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
