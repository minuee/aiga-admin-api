import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
//import AppConfig from './app.config';
//import SecurityConfig from './security.config';
import PaginationConfig from './pagination.config';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env${
        process.env.NODE_ENV ? `.${process.env.NODE_ENV}` : ''
      }`,
      load: [ PaginationConfig],
    }),
  ],
})
export class ConfigModule {}
