import { IITunesResult } from './iitunes-result.interface';

export interface IITunesResponse {
  resultCount: number;
  results: IITunesResult[];
}
