import { TestBed } from '@angular/core/testing';

import { GameHubBrokerService } from './game-hub-broker.service';

describe('GameHubBrokerService', () => {
  let service: GameHubBrokerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameHubBrokerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
