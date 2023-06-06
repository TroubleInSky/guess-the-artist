import { Injectable } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import { IITunesResponse } from '../../common/interfaces/itunes/iitunes-response.interface';

@Injectable()
export class ITunesService {
  static readonly ITUNES_BASE_URL = 'https://itunes.apple.com';
  static readonly ITUNES_LOAD_LIMIT = 25;

  async searchByArtistName(artistName: string) {
    const headers = { 'Content-Type': 'application/json' };
    const term = artistName.replace(/\s/g, '+');
    const response: AxiosResponse<IITunesResponse> = await axios.get(
      `${ITunesService.ITUNES_BASE_URL}/search?term=${term}&entity=album&limit=${ITunesService.ITUNES_LOAD_LIMIT}`,
      { headers },
    );
    return response.data;
  }
}
