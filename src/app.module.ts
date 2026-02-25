import { ConfigModule } from './config/config.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Post } from './typeorm/entities/Post';
import { Profile } from './typeorm/entities/Profile';
import { User } from './typeorm/entities/User';
import { Hospital } from './typeorm/entities/Hospital';
import { HospitalEvaluation } from './typeorm/entities/HospitalEvaluation';
import { Doctor } from './typeorm/entities/Doctor';
import { DoctorCareer } from './typeorm/entities/DoctorCareer';
import { DoctorPaper } from './typeorm/entities/DoctorPaper';
import { DoctorEvaluation } from './typeorm/entities/DoctorEvaluation';
import { Review } from './typeorm/entities/Review'; // Review 엔티티 임포트
import { Opinion } from './typeorm/entities/Opinion'; // Opinion 엔티티 임포트
import { AigaUser } from './typeorm/entities/AigaUser'; // Review 엔티티 임포트
import { Notice } from './typeorm/entities/Notice'; // Opinion 엔티티 임포트
import { Chatting } from './typeorm/entities/Chatting'; // Chatting 엔티티 임포트
import { TokenResetLog } from './typeorm/entities/TokenResetLog';
import { HospitalAlias } from './typeorm/entities/HospitalAlias'; // HospitalAlias 엔티티 임포트 추가
import { UsersModule } from './users/users.module';
import { HospitalsModule } from './hospital/hospitals.module';
import { DoctorsModule } from './doctor/doctors.module';
import { ReviewsModule } from './review/reviews.module';
import { OpinionsModule } from './opinion/opinions.module';
import { NoticeModule } from './notice/notices.module';
import { AigaUsersModule } from './aiga-users/aiga-users.module';
import { StatisticsModule } from './statistics/statistics.module';
import { ChatSearchLog } from './typeorm/entities/ChatSearchLog';
import { ChatSearchProposal } from './typeorm/entities/ChatSearchProposal';
import { DoctorSpecialty } from './typeorm/entities/DoctorSpecialty';
import { Specialty } from './typeorm/entities/Specialty';
import { StandardDeptSpec } from './typeorm/entities/StandardDeptSpec';
import { StandardSpecialty } from './typeorm/entities/StandardSpecialty';
import { DataHistory } from './typeorm/entities/DataHistory';

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
      entities: [ Hospital,Doctor,DoctorEvaluation, User,Profile,Post,DoctorCareer,DoctorPaper, HospitalAlias, HospitalEvaluation, DoctorSpecialty, Specialty, StandardDeptSpec, StandardSpecialty, DataHistory],
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
      entities: [Review,Opinion,AigaUser,Notice,Chatting, TokenResetLog, ChatSearchLog, ChatSearchProposal], // DataHistory 추가
      synchronize: false,
    }),
    ConfigModule,
    UsersModule,
    HospitalsModule,
    DoctorsModule,
    ReviewsModule,
    OpinionsModule,
    NoticeModule,
    AigaUsersModule,
    StatisticsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}