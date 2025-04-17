import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Doctor } from 'src/typeorm/entities/Doctor';
import { CreateDoctorDto } from 'src/doctor/dtos/CreateDoctor.dto';
import { CreateDoctorParams, } from 'src/utils/types';
import { Repository,Like } from 'typeorm';


@Injectable()
export class DoctorsService {
  constructor(
    @InjectRepository(Doctor) private doctorsRepository: Repository<Doctor>
  ) {}

  async findDoctors() {
    const data = await this.doctorsRepository.findAndCount(
      {
        select : ['hid','rid','deptname','doctorname'],
        order : {
          hid : "ASC",
          deptname : "ASC",
          doctorname : "ASC"
        },
        skip : 0,
        take : 10
      }
    );

    if ( data?.length > 0 ) {
      return {
        data : data[0],
        meta : {
          totalCount : data[1],
          page : 0,
          last_page : Math.ceil(data[1] / 10 )
        }
      }
    }else{
      return { 
        data : [],
        meta : {
          totalCount : 0,
          page : 0,
          last_page : 0
        }
      }
    }
  }

  findDoctorsByHid( id : string) {
    return this.doctorsRepository.find({
      where : {
        hid : id
      }
    });
  }

  findDoctorsByKeyword( search_word : string) {
    return this.doctorsRepository.find({
      where : {
        doctorname : Like(`%${search_word}%`)
      }
    });
  }


  createDoctor(doctorDetails: CreateDoctorParams) {
    const newDoctor = this.doctorsRepository.create({
      ...doctorDetails
    });

    return this.doctorsRepository.save(newDoctor);
  }
}
