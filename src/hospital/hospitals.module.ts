import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from 'src/typeorm/entities/Post';
import { Profile } from 'src/typeorm/entities/Profile';
import { User } from 'src/typeorm/entities/User';
import { Hospital } from 'src/typeorm/entities/Hospital';
import { HospitalAlias } from 'src/typeorm/entities/HospitalAlias';
import { HospitalEvaluation } from 'src/typeorm/entities/HospitalEvaluation'; // HospitalEvaluation Entity 추가
import { HospitalsController } from './controllers/hospitals/hospitals.controller';
import { HospitalsService } from './services/hospitals/hospitals.service';

@Module({
  imports: [TypeOrmModule.forFeature([Hospital, User, Profile, Post, HospitalAlias, HospitalEvaluation])], // HospitalEvaluation 추가
  controllers: [HospitalsController],
  providers: [HospitalsService],
})
export class HospitalsModule {}