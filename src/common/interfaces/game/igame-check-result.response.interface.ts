import { IGameStep } from './igame-step.interface';

export interface IGameCheckResultResponse {
  isRight: boolean;
  step?: IGameStep;
}
