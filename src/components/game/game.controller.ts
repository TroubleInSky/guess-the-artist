import { Body, Controller, Get, Post } from '@nestjs/common';
import { GameRoutes } from '../../common/enums/routes/game.routes.enum';
import { GameService } from './game.service';
import { IGameCheckResultRequest } from '../../common/interfaces/game/igame-check-result.request.interface';
import { IGameStartResponse } from '../../common/interfaces/game/igame-start.response.interface';
import { IGameCheckResultResponse } from '../../common/interfaces/game/igame-check-result.response.interface';
import { IGameFinishRequest } from '../../common/interfaces/game/igame-finish.request.interface';
import { IGameFinishResponse } from '../../common/interfaces/game/igame-finish.response.interface';
import { PlayerService } from '../player/player.service';
import { IGetTopPlayerRequestInterface } from '../../common/interfaces/player/iget-top-player.request.interface';
import { IGetTopPlayerResponseInterface } from '../../common/interfaces/player/iget-top-player.response.interface';

@Controller(GameRoutes.BASE_PREFIX)
export class GameController {
  constructor(
    private readonly gameService: GameService,
    private readonly playerService: PlayerService,
  ) {}

  @Get(GameRoutes.NEW_GAME)
  async startNewGame(): Promise<IGameStartResponse> {
    const game = await this.gameService.startNewGame();
    const nextStep = await this.gameService.gameNextStep(game.id);
    return {
      gameId: game.id,
      step: nextStep,
    };
  }

  @Post(GameRoutes.CHECK_RESULT)
  async checkResult(
    @Body() body: IGameCheckResultRequest,
  ): Promise<IGameCheckResultResponse> {
    const isResultRight = await this.gameService.checkResult(
      body.gameId,
      body.answer,
    );
    if (isResultRight) {
      return {
        isRight: true,
      };
    }
    const nextStep = await this.gameService.gameNextStep(body.gameId);
    return {
      isRight: false,
      step: nextStep,
    };
  }

  @Post(GameRoutes.FINISH_GAME)
  async finishGame(
    @Body() body: IGameFinishRequest,
  ): Promise<IGameFinishResponse> {
    return await this.gameService.finishGame(body.gameId, body.playerInfo);
  }

  @Post(GameRoutes.TOP_PLAYERS)
  async topPlayers(
    @Body() body: IGetTopPlayerRequestInterface,
  ): Promise<IGetTopPlayerResponseInterface[]> {
    return await this.playerService.getTopPlayers(body.count);
  }
}
