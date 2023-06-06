import { AppException } from '../app.exception';
import { HttpStatus } from '@nestjs/common';

export class GameNotFoundException extends AppException {
  constructor(gameId: number) {
    super(`Game ${gameId} not found!`, HttpStatus.NOT_FOUND);
  }
}
