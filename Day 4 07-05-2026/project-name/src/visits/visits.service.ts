import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class VisitService {
  constructor(private prisma: PrismaService) {}

  create(data: any) {
    return this.prisma.visit.create({ data });
  }

  findAll() {
    return this.prisma.visit.findMany({
      include: { user: true, property: true },
    });
  }

  findOne(id: number) {
    return this.prisma.visit.findUnique({
      where: { id },
      include: { user: true, property: true },
    });
  }

  update(id: number, data: any) {
    return this.prisma.visit.update({
      where: { id },
      data,
    });
  }

  remove(id: number) {
    return this.prisma.visit.delete({
      where: { id },
    });
  }
}