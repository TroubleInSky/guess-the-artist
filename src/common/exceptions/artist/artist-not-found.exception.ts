import { AppException } from '../app.exception';
import { HttpStatus } from '@nestjs/common';

export class ArtistNotFoundException extends AppException {
  constructor(artistName: string) {
    super(`Artist ${artistName} not found!`, HttpStatus.NOT_FOUND);
  }
}
