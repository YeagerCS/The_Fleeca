import { TestBed } from '@angular/core/testing';

import { DataSourceSharingService } from './data-source-sharing.service';

describe('DataSourceSharingService', () => {
  let service: DataSourceSharingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataSourceSharingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
