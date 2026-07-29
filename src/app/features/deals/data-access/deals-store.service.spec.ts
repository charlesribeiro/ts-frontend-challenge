import { TestBed } from '@angular/core/testing';

import { DealsStoreService } from './deals-store.service';

describe('DealsStoreService', () => {
  let service: DealsStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DealsStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
