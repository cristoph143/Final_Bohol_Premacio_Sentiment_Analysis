import { TestBed } from '@angular/core/testing';

import { ScoreFrequencyService } from './score-frequency.service';

describe('ScoreFrequencyService', () => {
  let service: ScoreFrequencyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScoreFrequencyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
