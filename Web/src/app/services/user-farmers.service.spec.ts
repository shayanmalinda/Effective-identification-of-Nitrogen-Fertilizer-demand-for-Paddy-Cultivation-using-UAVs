import { TestBed } from '@angular/core/testing';

import { UserFarmersService } from './user-farmers.service';

describe('UserFarmersService', () => {
  let service: UserFarmersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserFarmersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
