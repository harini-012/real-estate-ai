import { Module } from '@nestjs/common'

import { PrismaModule } from '../prisma/prisma.module'

import { UserModule } from '../user/user.module'
import { ChatModule } from '../chat/chat.module';
@Module({

  imports: [

    PrismaModule,

    UserModule,
    ChatModule

  ]

})

export class AppModule {}