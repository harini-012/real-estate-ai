import { Body, Controller, Post } from '@nestjs/common';
import { VoiceReplyService } from './voice-reply.service';

@Controller('voice-reply')
export class VoiceReplyController {
  constructor(
    private readonly voiceReplyService: VoiceReplyService,
  ) {}

  @Post()
  async reply(
    @Body()
    body: {
      userId: number;
      message: string;
    },
  ) {
    return this.voiceReplyService.handleVoiceReply(
      body.userId,
      body.message,
    );
  }
}