import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from 'src/typeorm/entities/Review';
import { AigaUser } from 'src/typeorm/entities/AigaUser';
import { Doctor } from 'src/typeorm/entities/Doctor'; // Doctor 엔티티 임포트
import { UpdateReviewParams } from 'src/utils/types';
import { Repository,Like } from 'typeorm';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review, 'service')
    private readonly reviewsRepository: Repository<Review>,
    @InjectRepository(Doctor, 'default') // 'default' 연결의 Doctor Repository 주입
    private readonly doctorRepository: Repository<Doctor>,
  ) {}

  findReviews() {
    return this.reviewsRepository.find();
  }

  paginate( query:any) {
    const { page, take, orderName, order } = query;
    return this.reviewsRepository.findAndCount({
      skip : page == 1 ? page-1 : (page-1)*take,
      take : take,
      order : {
        [orderName] : [order],
      },
    });
  }

  async paginate2( query:any) {
    const { page, take, isOrder, orderName, order  } = query;

    // 1. 'service' DB에서 리뷰 데이터 페이징 조회
    const reviewsQuery = this.reviewsRepository.createQueryBuilder('tb_review')
      .select(["tb_review.*, user.nickname, user.email"])
      .addSelect((qb) => {
        const subQuery = qb.select('COUNT(*) as totalCount').from(Review, 'tr');
        return subQuery;
      }, "totalCount")
      .leftJoin(AigaUser, 'user', 'user.user_id = tb_review.user_id')
      .orderBy(orderName, order)
      .offset(page == 1 ? page - 1 : (page - 1) * take)
      .limit(take);

    const reviews = await reviewsQuery.getRawMany();

    if (reviews.length === 0) {
      return [];
    }

    // 2. 리뷰에서 doctor_id 목록 추출
    const doctorIds = reviews.map(review => review.doctor_id).filter(id => id); // null이나 undefined인 id 제외

    if (doctorIds.length === 0) {
      return reviews; // 의사 정보가 없는 경우, 리뷰만 반환
    }

    // 3. 'default' DB에서 의사 정보와 병원 정보를 함께 조회
    const doctors = await this.doctorRepository.createQueryBuilder('doctor')
      .leftJoinAndSelect('doctor.hospital', 'hospital') // hospital 정보를 함께 가져오도록 조인
      .where('doctor.doctor_id IN (:...doctorIds)', { doctorIds })
      .getMany();

    // 4. 의사 정보를 Map으로 변환하여 쉽게 찾을 수 있도록 함
    const doctorsMap = new Map(doctors.map(doctor => [doctor.doctor_id, doctor]));

    // 5. 리뷰 데이터에 의사 정보 조합
    const combinedResults = reviews.map(review => {
      const doctorInfo = doctorsMap.get(review.doctor_id);
      return {
        ...review,
        doctor_basic: doctorInfo || null, // 리뷰에 해당하는 의사 정보 추가
      };
    });

    return combinedResults;
  }


  paginate2_old( query:any) {
    const { page, take, isOrder, orderName, order  } = query;
    return this.reviewsRepository.createQueryBuilder('tb_review')
    .select(["tb_review.*,user.nickname"])
    .addSelect((qb) => {
      const subQuery = qb.select('COUNT(*) as totalCount').from(Review,'tr');
      return subQuery;
    }, "totalCount")
    .leftJoin(AigaUser,'user','user.user_id = tb_review.user_id')
    .orderBy(orderName,order)
    .offset(page == 1 ? page-1 : (page-1)*take)
    .limit(take)
    .getRawMany();
  }

  findReviewsByReview_id( review_id : string) {
    return this.reviewsRepository.find({
      where : {
        review_id : review_id
      }
    });
  }

  findReviewsByKeyword( search_word : string) {
    return this.reviewsRepository.find({
      where : {
        content : Like(`%${search_word}%`)
      }
    });
  }


  updateReview(review_id: string, updateReviewDetails: UpdateReviewParams) {
    return this.reviewsRepository.update({ review_id }, { ...updateReviewDetails });
  }
}