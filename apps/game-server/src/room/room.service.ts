import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PlayerService {
  constructor(private readonly prisma: PrismaService ) {}

  async getPlayersFromRoom(room_id: string) {
    return this.prisma.player.findMany({
      where: {
        game_room_id: room_id,
      }
    })
  }

}
