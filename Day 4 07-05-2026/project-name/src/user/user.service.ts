import {

  Injectable

} from '@nestjs/common'

import { PrismaService } from '../prisma/prisma.service'

@Injectable()

export class UserService {

  constructor(

    private prisma: PrismaService

  ) {}

  // =====================================
  // REGISTER
  // =====================================

  async register(data: any) {

    const existingUser = await this.prisma.user.findUnique({

      where: {

        mobile: data.mobile

      }

    })

    // =====================================
    // EXISTING USER
    // =====================================

    if (existingUser) {

      return {

        message: 'existing user',

        userId: existingUser.id

      }
    }

    // =====================================
    // CREATE USER
    // =====================================

    const user = await this.prisma.user.create({

      data: {

        name: data.name,

        mobile: data.mobile,

        city: data.city

      }

    })

    return {

      message: 'registered',

      userId: user.id

    }
  }

  // =====================================
  // GET USER
  // =====================================

  async getUser(id: number) {

    return this.prisma.user.findUnique({

      where: {

        id

      }

    })
  }

  // =====================================
  // CHECK USER
  // =====================================

  async checkUser(id: number) {

    const user = await this.prisma.user.findUnique({

      where: {

        id

      }

    })

    return {

      exists: !!user

    }
  }
}