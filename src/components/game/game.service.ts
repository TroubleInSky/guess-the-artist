import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GameEntity } from '../../entities/game.entity';
import { Repository } from 'typeorm';
import { ArtistService } from '../artist/artist.service';
import { IGameStep } from '../../common/interfaces/game/igame-step.interface';
import { appConfigInstance } from '../../common/infrastructure/app.config';
import { GameIsFinishedException } from '../../common/exceptions/game/game-is-finished.exception';
import { RawSearch } from '../../common/helpers/raw-search.helper';
import { IPlayerInfo } from '../../common/interfaces/player/iplayer-info.interface';
import { PlayerService } from '../player/player.service';
import { GameNotFoundException } from '../../common/exceptions/game/game-not-found.exception';
import { IGameFinishResponse } from '../../common/interfaces/game/igame-finish.response.interface';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(GameEntity)
    private readonly gameRepository: Repository<GameEntity>,
    private readonly artistService: ArtistService,
    private readonly playerService: PlayerService,
  ) {}

  getGameScore(step: number): number {
    return (
      (appConfigInstance.GAME_STEPS_COUNT - step + 1) *
      appConfigInstance.POINTS_PER_STEP
    );
  }

  async startNewGame(): Promise<GameEntity> {
    const artist = await this.artistService.getRandomArtist();
    const game = this.gameRepository.create({
      artist,
      step: 0,
      usedAlbums: [],
    });
    return this.gameRepository.save(game);
  }

  async checkResult(gameId: number, answer: string): Promise<boolean> {
    const game = await this.gameRepository.findOne({
      where: { id: gameId, artist: { name: RawSearch(answer) } },
    });
    if (game) {
      game.isFinished = true;
      await this.gameRepository.save(game);
    }
    return !!game;
  }

  async gameNextStep(gameId: number): Promise<IGameStep> {
    const game = await this.gameRepository.findOne({
      where: { id: gameId, isFinished: false },
      relations: { artist: true },
    });
    if (!game) {
      throw new GameNotFoundException(gameId);
    }
    game.step += 1;
    if (game.step > appConfigInstance.GAME_STEPS_COUNT) {
      game.isFinished = true;
      await this.gameRepository.save(game);
      throw new GameIsFinishedException(game.id);
    }
    const album = await this.artistService.getRandomAlbum(
      game.artist.id,
      game.usedAlbums,
    );
    game.usedAlbums.push(album.id);
    await this.gameRepository.save(game);
    const gameStep: IGameStep = {
      step: game.step,
      album: {
        name: album.name,
        image: album.image,
      },
      stepsRemains: appConfigInstance.GAME_STEPS_COUNT - game.step,
    };
    return gameStep;
  }

  async finishGame(
    gameId: number,
    playerInfo: IPlayerInfo,
  ): Promise<IGameFinishResponse> {
    const game = await this.gameRepository.findOne({ where: { id: gameId } });
    if (!game) {
      throw new GameNotFoundException(gameId);
    }
    const score = this.getGameScore(game.step);
    const player = await this.playerService.savePlayer(playerInfo, score);
    return {
      username: player.username,
      score,
      maxScore: player.score,
    };
  }
}
