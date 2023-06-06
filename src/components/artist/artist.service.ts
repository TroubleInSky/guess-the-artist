import { Injectable, OnModuleInit } from '@nestjs/common';
import { appConfigInstance } from '../../common/infrastructure/app.config';
import { InjectRepository } from '@nestjs/typeorm';
import { ArtistEntity } from '../../entities/artist.entity';
import { Repository } from 'typeorm';
import { ArtistAlbumEntity } from '../../entities/artist-album.entity';
import { ITunesService } from '../itunes/itunes.service';
import { ArtistHasNotEnoughAlbumsException } from '../../common/exceptions/artist/artist-has-not-enough-albums.exception';
import { IITunesResponse } from '../../common/interfaces/itunes/iitunes-response.interface';
import { ArtistNotFoundException } from '../../common/exceptions/artist/artist-not-found.exception';
import { IITunesResult } from '../../common/interfaces/itunes/iitunes-result.interface';
import { FileLoggerService } from '../file-logger/file-logger.service';
import { Filename } from '../../common/enums/file/filename.enum';

@Injectable()
export class ArtistService implements OnModuleInit {
  constructor(
    @InjectRepository(ArtistEntity)
    private readonly artistRepository: Repository<ArtistEntity>,
    @InjectRepository(ArtistAlbumEntity)
    private readonly artistAlbumRepository: Repository<ArtistAlbumEntity>,
    private readonly iTunesService: ITunesService,
    private readonly fileLoggerService: FileLoggerService,
  ) {}

  async onModuleInit(): Promise<void> {
    const artists = appConfigInstance.ARTISTS;
    const artistsEntities = await this.getAllArtists();
    if (!artistsEntities.length) {
      await this.loadArtistsAndAlbums(artists);
    }
  }

  async addArtist(artistName: string): Promise<ArtistEntity> {
    const artist = this.artistRepository.create({
      name: artistName,
    });
    return await this.artistRepository.save(artist);
  }

  async getAllArtists(): Promise<ArtistEntity[]> {
    return await this.artistRepository.find();
  }

  async getRandomArtist(): Promise<ArtistEntity> {
    const artistsLength = await this.artistRepository.count();
    const rand = Math.floor(Math.random() * artistsLength);
    const artists = await this.artistRepository.find({ skip: rand, take: 1 });
    return artists[0];
  }

  async getRandomAlbum(artistId: number, escapeEntities: number[] = null) {
    const artistsLength = await this.artistAlbumRepository
      .createQueryBuilder('album')
      .where('album.artistId=:artistId AND album.id NOT IN (:...ids)', {
        artistId,
        ids: escapeEntities,
      })
      .getCount();

    const rand = Math.floor(Math.random() * artistsLength);

    const albums = await this.artistAlbumRepository
      .createQueryBuilder('album')
      .where('album.artistId=:artistId AND album.id NOT IN (:...ids)', {
        artistId,
        ids: escapeEntities,
      })
      .skip(rand)
      .take(1)
      .getMany();
    return albums[0];
  }

  async addArtistAlbum(
    artistId: number,
    album: IITunesResult,
  ): Promise<ArtistAlbumEntity> {
    const url = album.artworkUrl100;
    const image = url.replace('100x100bb', '1000x1000bb');
    const artistAlbum = this.artistAlbumRepository.create({
      artist: { id: artistId },
      name: album.collectionName,
      image,
    });
    return await this.artistAlbumRepository.save(artistAlbum);
  }

  private async loadArtistsAndAlbums(
    artists: string[],
  ): Promise<ArtistEntity[]> {
    const loadArtist = async (artistName: string): Promise<ArtistEntity> => {
      const itunesData: IITunesResponse =
        await this.iTunesService.searchByArtistName(artistName);
      if (!itunesData || !itunesData.results) {
        throw new ArtistNotFoundException(artistName);
      }
      const albums = this.filterITunesResults(itunesData.results);

      if (itunesData.resultCount < appConfigInstance.ALBUMS_TO_SAVE) {
        throw new ArtistHasNotEnoughAlbumsException(artistName);
      }
      const randomAlbums = this.getRandomAlbums(albums);
      const artist = await this.addArtist(artistName);
      await Promise.all(
        randomAlbums.map((album: IITunesResult) =>
          this.addArtistAlbum(artist.id, album),
        ),
      );
      this.fileLoggerService.saveToFile(
        Filename.ALBUMS_AVAILABLE,
        `${artist.name} new albums available: ${randomAlbums
          .map((album) => album.collectionName)
          .join(',')} \n`,
        true,
      );
      return artist;
    };
    return await Promise.all(artists.map(loadArtist));
  }

  private filterITunesResults(results: IITunesResult[]) {
    return results.filter(
      (result) =>
        !!result.collectionName &&
        result.trackCount > 1 &&
        result.collectionName.search(/- Single/g) === -1,
    );
  }

  private getRandomAlbums(albums: IITunesResult[]): IITunesResult[] {
    if (albums.length === appConfigInstance.ALBUMS_TO_SAVE) {
      return albums;
    }
    const randomAlbums: IITunesResult[] = [];
    while (randomAlbums.length < appConfigInstance.ALBUMS_TO_SAVE) {
      const r = Math.floor(Math.random() * albums.length);
      randomAlbums.push(albums[r]);
      albums = albums.filter(
        (album) => album.collectionName !== albums[r]?.collectionName,
      );
    }
    return randomAlbums;
  }
}
