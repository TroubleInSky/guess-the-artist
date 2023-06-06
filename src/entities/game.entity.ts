import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ArtistEntity } from './artist.entity';
import { PlayerEntity } from './player.entity';

@Entity('game')
export class GameEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ArtistEntity)
  artist: ArtistEntity;

  @ManyToOne(() => PlayerEntity, { nullable: true })
  player: PlayerEntity;

  @Column({ nullable: true })
  score: number;

  @Column({ default: 1 })
  step: number;

  @Column({ type: 'simple-array' })
  usedAlbums: number[];

  @Column({ name: 'is_finished', default: false })
  isFinished: boolean;
}
