import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DivisionReportsComponent } from './division-reports.component';

describe('DivisionReportsComponent', () => {
  let component: DivisionReportsComponent;
  let fixture: ComponentFixture<DivisionReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DivisionReportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DivisionReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
