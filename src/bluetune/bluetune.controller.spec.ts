import { Test, TestingModule } from '@nestjs/testing';
import { BluetuneController } from './bluetune.controller';

describe('BluetuneController', () => {
  let controller: BluetuneController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BluetuneController],
    }).compile();

    controller = module.get<BluetuneController>(BluetuneController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
