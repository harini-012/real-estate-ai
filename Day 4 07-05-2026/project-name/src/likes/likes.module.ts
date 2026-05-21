import { Module } from '@nestjs/common';
import { LikeController } from './likes.controller';
import { LikeService } from './likes.service';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],

  controllers: [LikeController],
  providers: [LikeService],
})
export class LikeModule {}