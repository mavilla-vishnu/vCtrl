import { TestBed } from '@angular/core/testing';

import { StatesproviderService } from './statesprovider.service';

describe('StatesproviderService', () => {
  let service: StatesproviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StatesproviderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
