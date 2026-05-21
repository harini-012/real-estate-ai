import { Module } from '@nestjs/common';
import { PGDetailsService } from './pg-details.service';
import { PGDetailsController } from './pg-details.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { VoiceReplyModule } from '../voice-reply/voice-reply.module';

@Module({
  imports: [
    PrismaModule,
    VoiceReplyModule, // 🔥 REQUIRED
  ],
  controllers: [PGDetailsController],
  providers: [PGDetailsService],
})
export class PGDetailsModule {}