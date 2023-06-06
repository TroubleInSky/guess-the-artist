export interface IGameStep {
  step: number;
  album: {
    name: string;
    image: string;
  };
  stepsRemains: number;
}
