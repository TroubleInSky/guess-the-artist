import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

@Injectable()
export class AppConfig {
  constructor(private readonly configService: ConfigService) {}

  public get DB_PATH(): string {
    return this.configService.get<string>('DB_PATH');
  }

  public get PORT(): string {
    return this.configService.get<string>('PORT');
  }

  public get ALBUMS_TO_SAVE(): number {
    return this.configService.get<number>('ALBUMS_TO_SAVE');
  }

  public get GAME_STEPS_COUNT(): number {
    return this.configService.get<number>('GAME_STEPS_COUNT');
  }

  public get POINTS_PER_STEP(): number {
    return this.configService.get<number>('POINTS_PER_STEP');
  }

  public get TOP_PLAYERS_TO_SAVE(): number {
    return this.configService.get<number>('TOP_PLAYERS_TO_SAVE');
  }

  public get ARTISTS(): string[] {
    const artistsString = this.configService.get<string>('ARTISTS');
    return artistsString.split('|').map((str) => str.trim());
  }
}

config();
const configService = new ConfigService();
export const appConfigInstance = new AppConfig(configService);
