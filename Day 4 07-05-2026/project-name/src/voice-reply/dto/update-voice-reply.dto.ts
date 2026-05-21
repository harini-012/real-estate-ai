import { PartialType } from '@nestjs/mapped-types';
import { CreateVoiceReplyDto } from './create-voice-reply.dto';

export class UpdateVoiceReplyDto extends PartialType(CreateVoiceReplyDto) {}
