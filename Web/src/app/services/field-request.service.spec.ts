import { TestBed } from '@angular/core/testing';

import { FieldRequestService } from './field-request.service';

describe('FieldRequestService', () => {
  let service: FieldRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FieldRequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
