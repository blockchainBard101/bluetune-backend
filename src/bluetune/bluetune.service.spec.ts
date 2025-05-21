import { Test, TestingModule } from '@nestjs/testing';
import { BluetuneService } from './bluetune.service';

describe('BluetuneService', () => {
  let service: BluetuneService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BluetuneService],
    }).compile();

    service = module.get<BluetuneService>(BluetuneService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
