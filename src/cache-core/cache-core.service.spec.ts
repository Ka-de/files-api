import { Test, TestingModule } from '@nestjs/testing';
import { CacheCoreService } from './cache-core.service';

describe('CacheCoreService', () => {
  let service: CacheCoreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CacheCoreService],
    }).compile();

    service = module.get<CacheCoreService>(CacheCoreService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
