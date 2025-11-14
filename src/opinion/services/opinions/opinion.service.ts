import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Opinion } from 'src/typeorm/entities/Opinion';
import { AigaUser } from 'src/typeorm/entities/AigaUser';
import { Doctor } from 'src/typeorm/entities/Doctor'; // Doctor 엔티티 임포트
import { UpdateOpinionParams } from 'src/utils/types';
import { Repository,Like } from 'typeorm';

@Injectable()
export class OpinionsService {
  constructor(
    @InjectRepository(Opinion, 'service')
    private readonly opinionRepository: Repository<Opinion>,
    @InjectRepository(Doctor, 'default') // 'default' 연결의 Doctor Repository 주입
    private readonly doctorRepository: Repository<Doctor>,
  ) {}

  findReviews() {
    return this.opinionRepository.find();
  }

  paginate( query:any) {
    const { page, take, orderName, order } = query;
    return this.opinionRepository.findAndCount({
      skip : page == 1 ? page-1 : (page-1)*take,
      take : take,
      order : {
        [orderName] : [order],
      },
    });
  }

  async paginate2( query:any) {
    const { page, take, isOrder, orderName, order, is_clear = null , keyword = null} = query;
    
    // 1. 'service' DB에서 리뷰 데이터 페이징 조회
    const opinionsQuery = this.opinionRepository.createQueryBuilder('tb_opinion')
      .select(["tb_opinion.*, user.nickname, user.email"])
      .addSelect((qb) => {
        const subQuery = qb.select('COUNT(*) as totalCount').from(Opinion, 'tr');
        let hasWhereClause = false; // Add this flag

        if(is_clear != null) {
          subQuery.where('tr.is_clear = :add_clear', { add_clear: is_clear});
          hasWhereClause = true; // Set flag
        }
        if(keyword != null) {
          if (hasWhereClause) { // Use andWhere if a condition already exists
            subQuery.andWhere('tr.content LIKE :keyword', { keyword: `%${keyword}%`});
          } else { // Otherwise, use where
            subQuery.where('tr.content LIKE :keyword', { keyword: `%${keyword}%`});
            hasWhereClause = true;
          }
        }
        return subQuery;
      }, "totalCount")
      .leftJoin(AigaUser, 'user', 'user.user_id = tb_opinion.user_id')
      .andWhere(is_clear != null ? 'tb_opinion.is_clear = :add_clear' : '1=1', is_clear != null ? { add_clear: is_clear} : {})
      .andWhere(keyword != null ? 'tb_opinion.content LIKE :keyword' : '1=1', keyword != null ? { keyword: `%${keyword}%` } : {})
      .orderBy(orderName, order)
      .offset(page == 1 ? page - 1 : (page - 1) * take)
      .limit(take);

    const opinions = await opinionsQuery.getRawMany();

    if (opinions.length === 0) {
      return [];
    }

    // 2. 리뷰에서 doctor_id 목록 추출
    const doctorIds = opinions.map(opinion => opinion.doctor_id).filter(id => id); // null이나 undefined인 id 제외

    if (doctorIds.length === 0) {
      return opinions; // 의사 정보가 없는 경우, 리뷰만 반환
    }

    // 3. 'default' DB에서 의사 정보와 병원 정보를 함께 조회
    const doctors = await this.doctorRepository.createQueryBuilder('doctor')
      .leftJoinAndSelect('doctor.hospital', 'hospital') // hospital 정보를 함께 가져오도록 조인
      .where('doctor.doctor_id IN (:...doctorIds)', { doctorIds })
      .getMany();

    // 4. 의사 정보를 Map으로 변환하여 쉽게 찾을 수 있도록 함
    const doctorsMap = new Map(doctors.map(doctor => [doctor.doctor_id, doctor]));

    // 5. 리뷰 데이터에 의사 정보 조합
    const combinedResults = opinions.map(opinion => {
      const doctorInfo = doctorsMap.get(opinion.doctor_id);
      return {
        ...opinion,
        doctor_basic: doctorInfo || null, // 리뷰에 해당하는 의사 정보 추가
      };
    });

    return combinedResults;
  }


  findOpinionsByOpinion_id( opinion_id : string) {
    return this.opinionRepository.find({
      where : {
        opinion_id : opinion_id
      }
    });
  }

  findOpinionsByKeyword( search_word : string) {
    return this.opinionRepository.find({
      where : {
        content : Like(`%${search_word}%`)
      }
    });
  }


  updateOpinion(opinion_id: string, updateOpinionDetails: UpdateOpinionParams) {
    return this.opinionRepository.update({ opinion_id }, { ...updateOpinionDetails });
  }
}