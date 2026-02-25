import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Hospital } from 'src/typeorm/entities/Hospital';
import { Doctor as DoctorEntity } from 'src/typeorm/entities/Doctor';
import { HospitalAlias } from 'src/typeorm/entities/HospitalAlias';
import { HospitalEvaluation } from 'src/typeorm/entities/HospitalEvaluation'; // HospitalEvaluation Entity import
import { CreateHospitalParams, CreateHospitalAliasParams, UpdateHospitalAliasParams } from 'src/utils/types';
import { Repository,Like } from 'typeorm';

@Injectable()
export class HospitalsService {
  constructor(
    @InjectRepository(Hospital) private hospitalsRepository: Repository<Hospital>,
    @InjectRepository(HospitalAlias) private hospitalAliasRepository: Repository<HospitalAlias>,
    @InjectRepository(HospitalEvaluation) private hospitalEvaluationRepository: Repository<HospitalEvaluation>, // HospitalEvaluation Repository 주입
  ) {}

  findHospitals() {
    return this.hospitalsRepository.find();
  }

  findHospitalsAliasByHid(hid: string) {
    return this.hospitalAliasRepository.find({
      where: { hid },
      select: ['aid','standard_name', 'alias_name'],
      order: {
        created_at: 'ASC',
      },
    });
  }

  // 병원 평가 정보 조회 메서드 추가
  findHospitalEvaluationByHid(hid: string) {
    return this.hospitalEvaluationRepository.find({
      where: { hid },
      select: ['matchedDept', 'publicScore', 'dataVersionId'], // 필요한 필드만 선택
      order: {
        createAt: 'DESC', // 최신 평가를 먼저 가져오도록 정렬
      },
    });
  }

  createHospitalAlias(hospitalAliasDetails: CreateHospitalAliasParams) {
    const newHospitalAlias = this.hospitalAliasRepository.create({
      ...hospitalAliasDetails,
    });
    return this.hospitalAliasRepository.save(newHospitalAlias);
  }

  updateHospitalAlias(aid: number, updateHospitalAliasDetails: UpdateHospitalAliasParams) {
    return this.hospitalAliasRepository.update(
      { aid },
      {
        alias_name: updateHospitalAliasDetails.alias_name,
      },
    );
  }

  deleteHospitalAlias(aid: number) {
    return this.hospitalAliasRepository.delete({ aid });
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
    const { page, take, isOrder, orderName, order , isAll = false } = query;
    const isAllBoolean =  isAll == 'true' ? true : false;
    return this.hospitalsRepository.createQueryBuilder('hospital')
    .select(["hospital.*","COUNT(db.rid) as doctor_count"])
    .addSelect((qb) => {
      const subQuery = qb.select('COUNT(*) as totalCount').from(Hospital,'hp');
      if(isAllBoolean == false) {
        subQuery.where('hp.hid LIKE :hidPrefix', { hidPrefix: 'H01KR%' });
      }
      return subQuery;
    }, "totalCount")
    .leftJoin(DoctorEntity,'db','db.hid = hospital.hid')
    .groupBy('hospital.hid')
    .orderBy( isOrder == 'hid' ? `hospital.${orderName}` : orderName,order)
    .offset(page == 1 ? page-1 : (page-1)*take)
    .limit(take)
    .andWhere(isAllBoolean == false ? 'hospital.hid LIKE :hidPrefix' : '1=1', isAllBoolean == false ? { hidPrefix: 'H01KR%' } : {})
    .getRawMany();
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

  updateHospital(hid: string, updateHospitalDetails: CreateHospitalParams) {
    return this.hospitalsRepository.update({ hid }, { ...updateHospitalDetails });
  }
}
