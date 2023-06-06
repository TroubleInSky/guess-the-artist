import { IGameStep } from './igame-step.interface';

export interface IGameStartResponse {
  gameId: number;
  step: IGameStep;
}
