import { TestBed } from '@angular/core/testing';

import { HsnNumberProviderService } from './hsn-number-provider.service';

describe('HsnNumberProviderService', () => {
  let service: HsnNumberProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HsnNumberProviderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
