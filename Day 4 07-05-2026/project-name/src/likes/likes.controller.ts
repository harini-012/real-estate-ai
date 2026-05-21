import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
} from '@nestjs/common';

import { LikeService } from './likes.service';
import { CreateLikeDto } from './dto/create-like.dto';

@Controller('likes')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  // Create Like
  @Post()
  create(@Body() dto: CreateLikeDto) {
    return this.likeService.createLike(dto);
  }

  // Get All Likes
  @Get()
  findAll() {
    return this.likeService.getAllLikes();
  }

  // Get Like By ID
 @Get('user/:userId')
findUserLikes(@Param('userId') userId: string) {
  return this.likeService.getUserLikes(Number(userId));
}

@Get(':id')
findOne(@Param('id') id: string) {
  return this.likeService.getLikeById(Number(id));
}
  // Delete Like
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.likeService.deleteLike(Number(id));
  }
}