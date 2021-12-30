import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldVisitRequestsComponent } from './field-visits.component';

describe('FieldVisitRequestsComponent', () => {
  let component: FieldVisitRequestsComponent;
  let fixture: ComponentFixture<FieldVisitRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FieldVisitRequestsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FieldVisitRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
