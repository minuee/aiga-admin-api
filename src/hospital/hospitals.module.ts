import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from 'src/typeorm/entities/Post';
import { Profile } from 'src/typeorm/entities/Profile';
import { User } from 'src/typeorm/entities/User';
import { Hospital } from 'src/typeorm/entities/Hospital';
import { HospitalsController } from './controllers/hospitals/hospitals.controller';
import { HospitalsService } from './services/hospitals/hospitals.service';

@Module({
  imports: [TypeOrmModule.forFeature([Hospital, User, Profile, Post])],
  controllers: [HospitalsController],
  providers: [HospitalsService],
})
export class HospitalsModule {}