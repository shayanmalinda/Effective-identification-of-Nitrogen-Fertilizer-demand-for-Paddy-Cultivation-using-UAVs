import { TestBed } from '@angular/core/testing';

import { LccService } from './lcc.service';

describe('LccService', () => {
  let service: LccService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LccService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
