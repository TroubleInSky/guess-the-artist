import { Module } from '@nestjs/common';
import { ArtistService } from './artist.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArtistEntity } from '../../entities/artist.entity';
import { ArtistAlbumEntity } from '../../entities/artist-album.entity';
import { ITunesModule } from '../itunes/itunes.module';
import { FileLoggerModule } from '../file-logger/file-logger.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ArtistEntity, ArtistAlbumEntity]),
    ITunesModule,
    FileLoggerModule,
  ],
  providers: [ArtistService],
  exports: [ArtistService],
})
export class ArtistModule {}
