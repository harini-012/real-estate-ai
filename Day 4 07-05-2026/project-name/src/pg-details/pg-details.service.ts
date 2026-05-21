import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { VoiceReplyService } from '../voice-reply/voice-reply.service'
import { CreatePGDetailsDto } from './dto/create-pg-detail.dto'

@Injectable()
export class PGDetailsService {
  constructor(
    private prisma: PrismaService,
    private voiceChatService: VoiceReplyService,
  ) {}

  async createPG(data: CreatePGDetailsDto) {
    const property = await this.prisma.pGDetails.create({
      data: {
        ...data,
        availableFrom: data.availableFrom
          ? new Date(data.availableFrom)
          : undefined,
        gateClosingTime: data.gateClosingTime
          ? new Date(data.gateClosingTime)
          : undefined,
      },
    });

    // Fire-and-forget Pinecone upsert
    this.voiceChatService
      .upsertPropertyVector({
        id: property.id,
        propertyName: property.propertyName,
        city: property.city,
        locality: property.locality,
        propertyType: property.propertyType,
      })
      .catch((err) =>
        console.error('Pinecone upsert failed:', err),
      );

    return property;
  }

  // Get All
  async getAllPGs() {
    return this.prisma.pGDetails.findMany({
      include: { user: true },
    });
  }

  // Get By ID
  async getPGById(id: number) {
    return this.prisma.pGDetails.findUnique({
      where: { id },
      include: { user: true },
    });
  }

  // Get By User
  async getUserPGs(userId: number) {
    return this.prisma.pGDetails.findMany({
      where: { userId },
    });
  }

  // Update
  async updatePG(id: number, data: Partial<CreatePGDetailsDto>) {
    return this.prisma.pGDetails.update({
      where: { id },
      data,
    });
  }

  // Delete
  async deletePG(id: number) {
    return this.prisma.pGDetails.delete({
      where: { id },
    });
  }
}