import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete
} from '@nestjs/common';

import { ChatService } from './chat.service';

import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';

@Controller('chat')
export class ChatController {

  constructor(
    private readonly chatService: ChatService
  ) {}

  // =========================================
  // SAVE CHAT FROM PYTHON
  // =========================================
  @Post('save')
  saveChat(@Body() body: any) {

    console.log("CHAT SAVE API HIT");

    return this.chatService.saveChat(body);
  }

  // =========================================
  // GET USER CHATS
  // =========================================
  @Get('user/:userId')
  getChats(
    @Param('userId') userId: string
  ) {
    return this.chatService.getChats(+userId);
  }

  // =========================================
  // OLD CRUD
  // =========================================
  @Post()
  create(@Body() createChatDto: CreateChatDto) {
    return this.chatService.create(createChatDto);
  }

  @Get()
  findAll() {
    return this.chatService.findAll();
  }

  // IMPORTANT
  // KEEP THIS LAST
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.chatService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateChatDto: UpdateChatDto
  ) {
    return this.chatService.update(+id, updateChatDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chatService.remove(+id);
  }
}