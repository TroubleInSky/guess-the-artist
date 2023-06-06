import { Module } from '@nestjs/common';
import { ArtistService } from './artist.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArtistEntity } from '../../entities/artist.entity';
import { ArtistAlbumEntity } from '../../entities/artist-album.entity';
import { ITunesModule } from '../itunes/itunes.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ArtistEntity, ArtistAlbumEntity]),
    ITunesModule,
  ],
  providers: [ArtistService],
  exports: [ArtistService],
})
export class ArtistModule {}
