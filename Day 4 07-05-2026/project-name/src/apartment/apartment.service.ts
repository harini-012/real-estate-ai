import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ApartmentService {
  constructor(private prisma: PrismaService) {}

  create(data: any) {
    return this.prisma.apartment.create({ data });
  }

  findAll() {
    return this.prisma.apartment.findMany();
  }

  findOne(id: number) {
    return this.prisma.apartment.findUnique({
      where: { id },
    });
  }

  update(id: number, data: any) {
    return this.prisma.apartment.update({
      where: { id },
      data,
    });
  }

  remove(id: number) {
    return this.prisma.apartment.delete({
      where: { id },
    });
  }
}