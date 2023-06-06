import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ArtistAlbumEntity } from './artist-album.entity';

@Entity('artist')
export class ArtistEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => ArtistAlbumEntity, (artistAlbum) => artistAlbum.artist)
  albums: ArtistAlbumEntity[];
}
