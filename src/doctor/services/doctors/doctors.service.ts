import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Doctor } from 'src/typeorm/entities/Doctor';
import { DoctorCareer } from 'src/typeorm/entities/DoctorCareer';
import { DoctorPaper } from 'src/typeorm/entities/DoctorPaper';
import { DoctorEvaluation } from 'src/typeorm/entities/DoctorEvaluation'; // DoctorEvaluation Entity import
import { CreateDoctorDto } from 'src/doctor/dtos/CreateDoctor.dto';
import { UpdateDoctorBasicDto } from 'src/doctor/dtos/UpdateDoctorBasic.dto';
import { UpdateDoctorCareerDto } from 'src/doctor/dtos/UpdateDoctorCareer.dto';
import { UpdateDoctorEvaluationDto } from 'src/doctor/dtos/UpdateDoctorEvaluation.dto';
import { CreateDoctorParams, } from 'src/utils/types';
import { Repository,Like } from 'typeorm';
import { Hospital } from 'src/typeorm/entities/Hospital';
import { DoctorSpecialty } from 'src/typeorm/entities/DoctorSpecialty';
import { Specialty } from 'src/typeorm/entities/Specialty';
import { DoctorSpecialtyDto } from 'src/doctor/dtos/DoctorSpecialty.dto';

@Injectable()
export class DoctorsService {
  constructor(
    @InjectRepository(Doctor) private doctorsRepository: Repository<Doctor>,
    @InjectRepository(Hospital) private hospitalRepository: Repository<Hospital>,
    @InjectRepository(DoctorCareer) private doctorsCareerRepository: Repository<DoctorCareer>,
    @InjectRepository(DoctorEvaluation) private doctorEvaluationRepository: Repository<DoctorEvaluation>, // DoctorEvaluation Repository 주입
    @InjectRepository(DoctorSpecialty) private doctorSpecialtyRepository: Repository<DoctorSpecialty>,
    @InjectRepository(Specialty) private specialtyRepository: Repository<Specialty>,
  ) {}

  async findDoctorSpecialtyByDoctorId(doctorId: number): Promise<DoctorSpecialtyDto[]> {
    const doctorSpecialties = await this.doctorSpecialtyRepository
      .createQueryBuilder('ds')
      .innerJoin('ds.specialty', 's')
      .where('ds.doctor_id = :doctorId', { doctorId })
      .select(['s.specialty_id as specialty_id', 's.specialty as specialty'])
      .getRawMany();

    return doctorSpecialties.map(item => ({
        specialty_id: item.specialty_id,
        specialty: item.specialty
    }));
  }

  async findDoctors() {
    const data = await this.doctorsRepository.findAndCount(
      {
        select : ['hid','rid_long','deptname','doctorname'],
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
      },
      order : {
        deptname : 'ASC'
      },
      skip : 0,
        take : 10
    });
  }

  // 의사 평가 정보 조회 메서드 추가
  findDoctorEvaluationByDoctorId(doctorId: number) {
    return this.doctorEvaluationRepository.find({
      where: { doctorId },
      select: [
        'doctorEvalId',
        'doctorId',
        'dataVersionId',
        'standardSpec',
        'kindness',
        'satisfaction',
        'explanation',
        'recommendation',
        'patientScore',
        'paperScore',
        'publicScore',
        'peerScore',
        'createAt',
        'updateAt',
      ],
      order: {
        createAt: 'DESC', // 최신 평가를 먼저 가져오도록 정렬
      },
    });
  }

  updateDoctorEvaluationByEvalId(doctorEvalId: number, updateDoctorEvaluationDto: UpdateDoctorEvaluationDto) {
    return this.doctorEvaluationRepository.update({ doctorEvalId }, { ...updateDoctorEvaluationDto });
  }

  deleteDoctorEvaluationByEvalId(doctorEvalId: number) {
    return this.doctorEvaluationRepository.delete({ doctorEvalId });
  }

  paginate( hid : string,query:any) {
    const { page, take, orderName, order,keyword, is_active = null } = query;
    const qb =  this.doctorsRepository.createQueryBuilder('db')
    .select(["db.*","dc.jsondata",'h2.shortName as prev_hospitalName'])
    .addSelect((subQuery) => {
      const sq = subQuery.select('COUNT(*)').from(Doctor, 'd_count')
        .where('d_count.hid = :hid', { hid });

      if (is_active != null) {
        if ( is_active == '9') {
          sq.andWhere('d_count.is_active in ( 1,2 )', { isActive: is_active });
        }else{
          sq.andWhere('d_count.is_active = :isActive', { isActive: is_active });
        }
      }
      if (keyword) {
        sq.andWhere("(d_count.doctorname LIKE :keyword OR d_count.specialties LIKE :keyword)", { keyword: `%${keyword}%` });
      }
      return sq;
    }, "totalCount")
    .leftJoin(DoctorCareer,'dc','db.rid = dc.rid')
    .leftJoin(Doctor,'db2','db.prev_rid = db2.rid_long')
    .leftJoin(Hospital,'h2','db2.hid = h2.hid')
    .where("db.hid = :hid", { hid });
    if ( is_active != null  ) {
      if ( is_active == '9') {
        qb.andWhere("db.is_active in ( 1,2 )", { isActive: is_active })
      }else{
        qb.andWhere("db.is_active = :isActive", { isActive: is_active })
      }
        
    }
    if ( keyword ) {
      qb.andWhere("(db.doctorname like :keyword OR db.specialties like :keyword)", { keyword: `%${keyword}%` })
    }
    return qb.orderBy( orderName == 'deptname' ? `db.${orderName}` : orderName,order)
    .offset(page == 1 ? page-1 : (page-1)*take)
    .limit(take)
    .getRawMany();
  }

  findDoctorsByKeyword( search_word : string) {
    return this.doctorsRepository.find({
      where : {
        doctorname : Like(`%${search_word}%`)
      }
    });
  }

  async findDoctorById(doctorId: string): Promise<any | undefined> {
    return await this.doctorsRepository.createQueryBuilder('doctor')
      .select([
        'doctor.*',
        'dc.jsondata AS jsondata',
        'prevHospital.shortName AS prev_hospitalName'
      ])
      .leftJoin(DoctorCareer,'dc','doctor.rid = dc.rid')
      .leftJoin(Doctor, 'prevDoctor', 'doctor.prev_rid = prevDoctor.rid_long')
      .leftJoin(Hospital, 'prevHospital', 'prevDoctor.hid = prevHospital.hid')
      .where('doctor.doctor_id = :doctorId', { doctorId })
      .getRawOne();
  }

  createDoctor(doctorDetails: CreateDoctorParams) {
    const newDoctor = this.doctorsRepository.create({
      ...doctorDetails
    });

    return this.doctorsRepository.save(newDoctor);
  }

  updateDoctorBasic(rid_long: string, updateDoctorBasicDetails: UpdateDoctorBasicDto) {
    return this.doctorsRepository.update({ rid_long }, { ...updateDoctorBasicDetails });
  }

  updateDoctorCareer(rid_long: string, updateDoctorCareerDetails: UpdateDoctorCareerDto) {
    console.log("updateDoctorCareerDetails).length",Object.keys(updateDoctorCareerDetails))
    if (Object.keys(updateDoctorCareerDetails).length === 0) {
      return Promise.resolve({ affected: 0 });
    }
    const updateData = {
      ...updateDoctorCareerDetails,
      jsondata: JSON.stringify(updateDoctorCareerDetails.jsondata),
      education: JSON.stringify(updateDoctorCareerDetails.education),
      career: JSON.stringify(updateDoctorCareerDetails.career),
      etc: JSON.stringify(updateDoctorCareerDetails.etc),
    };

    return this.doctorsCareerRepository.update({ rid_long }, updateData);
  }
}
