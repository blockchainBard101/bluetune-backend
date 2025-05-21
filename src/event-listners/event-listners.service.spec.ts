import { Test, TestingModule } from '@nestjs/testing';
import { EventListnersService } from './event-listners.service';

describe('EventListnersService', () => {
  let service: EventListnersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EventListnersService],
    }).compile();

    service = module.get<EventListnersService>(EventListnersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
