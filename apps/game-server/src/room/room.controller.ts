import { Body, Controller, Get, Post } from '@nestjs/common';
import { PlayerService } from './player.service';

@Controller()
export class PlayerController {

  constructor(private readonly playerService: PlayerService) {}

}
