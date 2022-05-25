import { TestBed } from '@angular/core/testing';

import { ForestClientServiceService } from './forest-client-service.service';

describe('ForestClientServiceService', () => {
  let service: ForestClientServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ForestClientServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
