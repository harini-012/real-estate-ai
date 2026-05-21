import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { PGDetailsService } from './pg-details.service';
import { CreatePGDetailsDto } from './dto/create-pg-detail.dto';

@Controller('pg-details')
export class PGDetailsController {
  constructor(private readonly pgDetailsService: PGDetailsService) {}

  // Create
  @Post()
  create(@Body() dto: CreatePGDetailsDto) {
    return this.pgDetailsService.createPG(dto);
  }

  // Get All
  @Get()
  findAll() {
    return this.pgDetailsService.getAllPGs();
  }

  // Get By ID
  @Get('user/:userId')
findUserPGs(@Param('userId') userId: string) {
  return this.pgDetailsService.getUserPGs(Number(userId));
}

@Get(':id')
findOne(@Param('id') id: string) {
  return this.pgDetailsService.getPGById(Number(id));
}

  // Update
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: Partial<CreatePGDetailsDto>,
  ) {
    return this.pgDetailsService.updatePG(Number(id), dto);
  }

  // Delete
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pgDetailsService.deletePG(Number(id));
  }
}