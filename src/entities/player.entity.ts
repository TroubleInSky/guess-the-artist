import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('player')
export class PlayerEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  username: string;

  @Column()
  score: number;
}
