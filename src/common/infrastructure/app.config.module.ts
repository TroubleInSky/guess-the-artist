import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppConfig } from './app.config';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [ConfigService, AppConfig],
  exports: [AppConfig],
})
export class AppConfigModule {}
