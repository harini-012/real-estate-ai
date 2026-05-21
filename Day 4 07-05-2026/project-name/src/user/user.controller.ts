import {

  Body,
  Controller,
  Get,
  Param,
  Post

} from '@nestjs/common'

import { UserService } from './user.service'

@Controller('user')

export class UserController {

  constructor(

    private readonly userService: UserService

  ) {}

  // =====================================
  // REGISTER
  // =====================================

  @Post('register')

  register(

    @Body() body: any

  ) {

    return this.userService.register(body)
  }

  // =====================================
  // CHECK USER
  // =====================================

  @Get('check/:id')

  checkUser(

    @Param('id') id: string

  ) {

    return this.userService.checkUser(
      Number(id)
    )
  }

  // =====================================
  // GET USER
  // =====================================

  @Get(':id')

  getUser(

    @Param('id') id: string

  ) {

    return this.userService.getUser(
      Number(id)
    )
  }
}