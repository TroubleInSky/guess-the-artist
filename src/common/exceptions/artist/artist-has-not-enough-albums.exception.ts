import { AppException } from '../app.exception';
import { HttpStatus } from '@nestjs/common';

export class ArtistHasNotEnoughAlbumsException extends AppException {
  constructor(artistName: string) {
    super(`Artist ${artistName} has not enough albums!`, HttpStatus.NOT_FOUND);
  }
}
