import { Injectable } from '@nestjs/common';

@Injectable()
export class VoiceReplyService {

  async handleVoiceReply(
    userId: number,
    message: string,
  ) {

    return {
      reply: `Hello User ${userId}, you said: ${message}`,
      audio: null,
    };
  }

  async upsertPropertyVector(data: any) {
    console.log('Vector Saved:', data);
  }
}