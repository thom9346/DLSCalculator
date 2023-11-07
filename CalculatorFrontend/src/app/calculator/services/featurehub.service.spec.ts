import { TestBed } from '@angular/core/testing';

import { FeaturehubService } from './featurehub.service';

describe('FeaturehubService', () => {
  let service: FeaturehubService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FeaturehubService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
