import { ConfigModule } from './config/config.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Post } from './typeorm/entities/Post';
import { Profile } from './typeorm/entities/Profile';
import { User } from './typeorm/entities/User';
import { Hospital } from './typeorm/entities/Hospital';
import { Doctor } from './typeorm/entities/Doctor';
import { DoctorCareer } from './typeorm/entities/DoctorCareer';
import { DoctorPaper } from './typeorm/entities/DoctorPaper';
import { Review } from './typeorm/entities/Review'; // Review 엔티티 임포트
import { AigaUser } from './typeorm/entities/AigaUser'; // Review 엔티티 임포트
import { UsersModule } from './users/users.module';
import { HospitalsModule } from './hospital/hospitals.module';
import { DoctorsModule } from './doctor/doctors.module';
import { ReviewsModule } from './review/reviews.module';

@Module({
  imports: [
    // 기본 DB 연결 (aiga2025)
    TypeOrmModule.forRoot({
      name: 'default', // 기본 연결 이름
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE, // aiga2025
      logging : true,
      entities: [ Hospital,Doctor,User,Profile,Post,DoctorCareer,DoctorPaper],
      synchronize: false,
    }),
    // 두 번째 DB 연결 (aiga2025_service)
    TypeOrmModule.forRoot({
      name: 'service', // 새로운 연결 이름
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: `${process.env.DB_DATABASE}_service`, // aiga2025_service
      logging : true,
      entities: [Review,AigaUser], // Review 엔티티를 이 연결에 할당
      synchronize: false,
    }),
    ConfigModule,
    UsersModule,
    HospitalsModule,
    DoctorsModule,
    ReviewsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}