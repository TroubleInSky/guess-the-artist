import { AppException } from '../app.exception';
import { HttpStatus } from '@nestjs/common';

export class GameIsFinishedException extends AppException {
  constructor(gameId: number) {
    super(`Game ${gameId} is finished!`, HttpStatus.BAD_REQUEST);
  }
}
