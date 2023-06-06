import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './data-source';
import { AppConfigModule } from './common/infrastructure/app.config.module';
import { ArtistModule } from './components/artist/artist.module';
import { GameModule } from './components/game/game.module';
import { PlayerModule } from './components/player/player.module';

@Module({
  imports: [
    AppConfigModule,
    TypeOrmModule.forRoot({
      ...dataSourceOptions,
      autoLoadEntities: false,
      logging: false,
    }),
    ArtistModule,
    GameModule,
    PlayerModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
