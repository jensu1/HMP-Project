import { TestBed } from '@angular/core/testing';

import { Kecenewsservice } from './kecenewsservice';

describe('Kecenewsservice', () => {
  let service: Kecenewsservice;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Kecenewsservice);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
