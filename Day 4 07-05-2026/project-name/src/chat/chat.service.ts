import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ChatService {

  constructor(
    private prisma: PrismaService
  ) {}

  async saveChat(body: any) {

    return this.prisma.chatMessage.create({

      data: {

        userId: body.userId,

        role: body.role,

        content: body.content,
      },
    });
  }

  async getChats(userId: number) {

    return this.prisma.chatMessage.findMany({

      where: {
        userId,
      },

      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  create(createChatDto: any) {
    return 'create';
  }

  findAll() {
    return 'find all';
  }

  findOne(id: number) {
    return `find ${id}`;
  }

  update(id: number, updateChatDto: any) {
    return `update ${id}`;
  }

  remove(id: number) {
    return `remove ${id}`;
  }
}
