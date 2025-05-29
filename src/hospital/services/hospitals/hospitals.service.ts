import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Hospital } from 'src/typeorm/entities/Hospital';
import { Doctor as DoctorEntity } from 'src/typeorm/entities/Doctor';
import { CreateHospitalParams } from 'src/utils/types';
import { Repository,Like } from 'typeorm';

@Injectable()
export class HospitalsService {
  constructor(
    @InjectRepository(Hospital) private hospitalsRepository: Repository<Hospital>
  ) {}

  findHospitals() {
    return this.hospitalsRepository.find();
  }

  paginate( query:any) {
    const { page, take, orderName, order } = query;
    return this.hospitalsRepository.findAndCount({
      skip : page == 1 ? page-1 : (page-1)*take,
      take : take,
      order : {
        [orderName] : [order],
      },
    });
  }

  paginate2( query:any) {
    const { page, take, isOrder, orderName, order } = query;
    return this.hospitalsRepository.createQueryBuilder('hospital')
    .select(["hospital.*","COUNT(db.rid) as doctor_count"])
    .addSelect((qb) => {
      return qb.select('COUNT(*) as totalCount').from(Hospital,'hp')
    }, "totalCount")
    .leftJoin(DoctorEntity,'db','db.hid = hospital.hid')
    .groupBy('hospital.hid')
    .orderBy( isOrder == 'hid' ? `hospital.${orderName}` : orderName,order)
    .offset(page == 1 ? page-1 : (page-1)*take)
    .limit(take)
    //.select(["hospital.hid","doctor_basic.doctor_count"])
    /*.leftJoin(subquery => {
      return subquery
        .select(['db.hid', 'COUNT(db.rid) as doctor_count'])
        .from(DoctorEntity, 'db')
        .groupBy('db.hid');
    }, 'doctor_basic','hospital.hid = doctors_basic.hid') */
    //.loadRelationCountAndMap('hospital.hid', 'a.comments')
    /* .loadRelationCountAndMap('hospital.hid','doctor_basic.hid','doctor_count')
    .addSelect((qb) => {
        return qb.select('COUNT(doctor_basic.*)','doctor_count').from(DoctorEntity,'doctor_basic').groupBy("doctor_basic.hid")
    }) */
    /* .andWhere((qb) => {
      // 지금까지 결제한 횟수를 알기 위해 OrderInfo 라는 Entity를 카운트한다.
      const subQuery = qb
        .subQuery()
        .select('COUNT(*)')
        .from(DoctorEntity, 'db') 
        .groupBy('db.hid')
        .getQuery();
  
      return `${subQuery} <= 2`;
    }) */
    .getRawMany();
    //.leftJoin('hospital.hid', 'doctor_basic','hospital.hid = doctors_basic.hid')
    ///.getRawMany()
  }

  findHospitalsByHid( id : string) {
    return this.hospitalsRepository.find({
      where : {
        hid : id
      }
    });
  }

  findHospitalsByKeyword( search_word : string) {
    return this.hospitalsRepository.find({
      where : {
        baseName : Like(`%${search_word}%`)
      }
    });
  }


  createHospital(hospitalDetails: CreateHospitalParams) {
    const newHospital = this.hospitalsRepository.create({
      ...hospitalDetails
    });

    return this.hospitalsRepository.save(newHospital);
  }
}