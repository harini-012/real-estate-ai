import { Test, TestingModule } from '@nestjs/testing';
import { VoiceReplyController } from './voice-reply.controller';
import { VoiceReplyService } from './voice-reply.service';

describe('VoiceReplyController', () => {
  let controller: VoiceReplyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VoiceReplyController],
      providers: [VoiceReplyService],
    }).compile();

    controller = module.get<VoiceReplyController>(VoiceReplyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
