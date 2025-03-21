import { ConfigModule } from './config/config.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Post } from './typeorm/entities/Post';
import { Profile } from './typeorm/entities/Profile';
import { User } from './typeorm/entities/User';
import { Hospital } from './typeorm/entities/Hospital';
import { UsersModule } from './users/users.module';
import { HospitalsModule } from './hospital/hospitals.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '1234',
      database: 'aiga2025',
      logging : true,
      entities: [ Hospital,User, Profile, Post ],
      synchronize: false,/* production 모드에서는 반드시 false 데이터 유실 위험이 있음  */
    }),
    ConfigModule,
    UsersModule,
    HospitalsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
