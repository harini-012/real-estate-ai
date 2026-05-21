import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';

import { Chat } from './entities/chat.entity';

@Injectable()
export class ChatService {

  constructor(

    @InjectRepository(Chat)
    private readonly chatRepository: Repository<Chat>,

  ) {}

  // =========================================
  // SAVE CHAT FROM PYTHON AI
  // =========================================
  async saveChat(data: any) {

    console.log('SERVICE SAVE:', data);

    const chat = this.chatRepository.create({

      userId: data.userId,

      role: data.role,

      content: data.content,

    });

    return await this.chatRepository.save(chat);
  }

  // =========================================
  // GET USER CHATS
  // =========================================
  async getChats(userId: number) {

    return await this.chatRepository.find({

      where: {
        userId,
      },

      order: {
        createdAt: 'DESC',
      },

    });
  }

  // =========================================
  // CREATE
  // =========================================
  async create(createChatDto: CreateChatDto) {

    const chat = this.chatRepository.create(createChatDto);

    return await this.chatRepository.save(chat);
  }

  // =========================================
  // FIND ALL
  // =========================================
  async findAll() {

    return await this.chatRepository.find({

      order: {
        createdAt: 'DESC',
      },

    });
  }

  // =========================================
  // FIND ONE
  // =========================================
  async findOne(id: number) {

    return await this.chatRepository.findOne({

      where: {
        id,
      },

    });
  }

  // =========================================
  // UPDATE
  // =========================================
  async update(
    id: number,
    updateChatDto: UpdateChatDto,
  ) {

    await this.chatRepository.update(
      id,
      updateChatDto,
    );

    return await this.findOne(id);
  }

  // =========================================
  // DELETE
  // =========================================
  async remove(id: number) {

    return await this.chatRepository.delete(id);
  }
}