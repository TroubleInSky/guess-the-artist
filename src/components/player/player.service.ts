import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PlayerEntity } from '../../entities/player.entity';
import { Repository } from 'typeorm';
import { IPlayerInfo } from '../../common/interfaces/player/iplayer-info.interface';
import { IGetTopPlayerResponseInterface } from '../../common/interfaces/player/iget-top-player.response.interface';

@Injectable()
export class PlayerService {
  constructor(
    @InjectRepository(PlayerEntity)
    private readonly playerRepository: Repository<PlayerEntity>,
  ) {}

  async savePlayer(
    playerInfo: IPlayerInfo,
    score: number,
  ): Promise<PlayerEntity> {
    const existedPlayer = await this.playerRepository.findOne({
      where: { username: playerInfo.username },
    });
    if (existedPlayer) {
      if (score > existedPlayer.score) {
        existedPlayer.score = score;
        return await this.playerRepository.save(existedPlayer);
      }
      return existedPlayer;
    }
    const player = this.playerRepository.create({
      username: playerInfo.username,
      score,
    });
    return await this.playerRepository.save(player);
  }

  async getTopPlayers(
    count: number,
  ): Promise<IGetTopPlayerResponseInterface[]> {
    const topPlayers = await this.playerRepository.find({
      take: count,
      order: {
        score: 'DESC',
      },
    });
    return topPlayers.map(
      (topPlayer): IGetTopPlayerResponseInterface => ({
        username: topPlayer.username,
        score: topPlayer.score,
      }),
    );
  }
}
