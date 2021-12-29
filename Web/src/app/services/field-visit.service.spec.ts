import { TestBed } from '@angular/core/testing';

import { FieldVisitService } from './field-visit.service';

describe('FieldVisitService', () => {
  let service: FieldVisitService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FieldVisitService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
