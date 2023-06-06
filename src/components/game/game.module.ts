import { Module } from '@nestjs/common';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameEntity } from '../../entities/game.entity';
import { ArtistModule } from '../artist/artist.module';
import { PlayerModule } from '../player/player.module';

@Module({
  imports: [TypeOrmModule.forFeature([GameEntity]), ArtistModule, PlayerModule],
  controllers: [GameController],
  providers: [GameService],
})
export class GameModule {}
