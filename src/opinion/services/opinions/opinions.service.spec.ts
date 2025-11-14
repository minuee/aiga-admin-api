import { Test, TestingModule } from '@nestjs/testing';
import { OpinionsService } from './opinion.service';

describe('UsersService', () => {
  let service: OpinionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OpinionsService],
    }).compile();

    service = module.get<OpinionsService>(OpinionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});