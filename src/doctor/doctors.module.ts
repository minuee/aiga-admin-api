import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hospital } from 'src/typeorm/entities/Hospital';
import { Doctor } from 'src/typeorm/entities/Doctor';
import { DoctorsController } from './controllers/doctors/doctors.controller';
import { DoctorsService } from './services/doctors/doctors.service';

@Module({
  imports: [TypeOrmModule.forFeature([Hospital,Doctor])],
  controllers: [DoctorsController],
  providers: [DoctorsService],
})
export class DoctorsModule {}
