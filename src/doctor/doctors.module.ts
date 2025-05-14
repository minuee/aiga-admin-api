import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hospital } from 'src/typeorm/entities/Hospital';
import { Doctor } from 'src/typeorm/entities/Doctor';
import { DoctorCareer } from 'src/typeorm/entities/DoctorCareer';
import { DoctorPaper } from 'src/typeorm/entities/DoctorPaper';
import { DoctorsController } from './controllers/doctors/doctors.controller';
import { DoctorsService } from './services/doctors/doctors.service';
import { DoctorPapersService } from './services/doctors/doctor_papers.service';

@Module({
  imports: [TypeOrmModule.forFeature([Hospital,Doctor,DoctorCareer,DoctorPaper])],
  controllers: [DoctorsController],
  providers: [DoctorsService,DoctorPapersService],
})
export class DoctorsModule {}
