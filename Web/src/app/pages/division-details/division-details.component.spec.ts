import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DivisionsDetailsComponent } from './division-details.component';

describe('DivisionsDetailsComponent', () => {
  let component: DivisionsDetailsComponent;
  let fixture: ComponentFixture<DivisionsDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DivisionsDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DivisionsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
