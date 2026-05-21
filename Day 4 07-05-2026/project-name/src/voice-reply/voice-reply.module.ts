import { Module } from '@nestjs/common';
import { VoiceReplyController } from './voice-reply.controller';
import { VoiceReplyService } from './voice-reply.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [VoiceReplyController],
  providers: [VoiceReplyService],
  exports: [VoiceReplyService],
})
export class VoiceReplyModule {}