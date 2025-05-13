import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hospital } from 'src/typeorm/entities/Hospital';
import { Doctor } from 'src/typeorm/entities/Doctor';
import { DoctorCareer } from 'src/typeorm/entities/DoctorCareer';
import { DoctorsController } from './controllers/doctors/doctors.controller';
import { DoctorsService } from './services/doctors/doctors.service';

@Module({
  imports: [TypeOrmModule.forFeature([Hospital,Doctor,DoctorCareer])],
  controllers: [DoctorsController],
  providers: [DoctorsService],
})
export class DoctorsModule {}
