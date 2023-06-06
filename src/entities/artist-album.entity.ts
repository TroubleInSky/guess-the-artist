import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ArtistEntity } from './artist.entity';

@Entity('artist_album')
export class ArtistAlbumEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ArtistEntity, (artist) => artist.albums)
  artist: ArtistEntity;

  @Column()
  name: string;

  @Column()
  image: string;
}
