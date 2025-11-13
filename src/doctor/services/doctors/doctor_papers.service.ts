import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';;
import { DoctorPaper } from 'src/typeorm/entities/DoctorPaper';
import { Repository,Like } from 'typeorm';


@Injectable()
export class DoctorPapersService {
  constructor(
    @InjectRepository(DoctorPaper) private doctorPapersRepository: Repository<DoctorPaper>
  ) {}

  findDoctorsByHid( id : string) {
    return this.doctorPapersRepository.find({
      where : {
        rid_long : id
      },
      order : {
        paper_id : 'ASC'
      },
      skip : 0,
      take : 1000
    });
  }

  deleteDoctorPaper(paper_id: string, ) {
    return this.doctorPapersRepository.delete({ paper_id });
  }
}
