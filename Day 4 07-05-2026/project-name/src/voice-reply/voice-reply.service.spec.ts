import { Test, TestingModule } from '@nestjs/testing';
import { VoiceReplyService } from './voice-reply.service';

describe('VoiceReplyService', () => {
  let service: VoiceReplyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VoiceReplyService],
    }).compile();

    service = module.get<VoiceReplyService>(VoiceReplyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
