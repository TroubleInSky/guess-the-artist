import { IPlayerInfo } from '../player/iplayer-info.interface';

export interface IGameFinishRequest {
  gameId: number;
  playerInfo: IPlayerInfo;
}
