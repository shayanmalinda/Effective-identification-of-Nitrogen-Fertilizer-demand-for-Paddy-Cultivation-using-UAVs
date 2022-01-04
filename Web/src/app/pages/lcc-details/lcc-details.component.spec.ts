import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LccDetailsComponent } from './lcc-details.component';

describe('LccDetailsComponent', () => {
  let component: LccDetailsComponent;
  let fixture: ComponentFixture<LccDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LccDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LccDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
