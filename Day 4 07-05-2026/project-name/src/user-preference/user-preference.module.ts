import { Module } from '@nestjs/common';
import { UserPreferenceController } from './user-preference.controller';
import { UserPreferenceService } from './user-preference.service';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaModule } from '../prisma/prisma.module';


@Module({
    imports: [PrismaModule],

  controllers: [UserPreferenceController],
  providers: [UserPreferenceService],
})
export class UserPreferenceModule {}