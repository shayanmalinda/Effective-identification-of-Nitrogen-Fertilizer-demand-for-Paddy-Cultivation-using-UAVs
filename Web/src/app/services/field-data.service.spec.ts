import { TestBed } from '@angular/core/testing';

import { FieldDataService } from './field-data.service';

describe('FieldDataService', () => {
  let service: FieldDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FieldDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
