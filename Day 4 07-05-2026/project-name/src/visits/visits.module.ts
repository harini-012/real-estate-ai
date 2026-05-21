import { Module } from '@nestjs/common';
import { VisitService } from './visits.service';
import { VisitController } from './visits.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [VisitController],
  providers: [VisitService],
})
export class VisitModule {}