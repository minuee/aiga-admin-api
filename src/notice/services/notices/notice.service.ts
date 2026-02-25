import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Notice } from 'src/typeorm/entities/Notice';
import { AigaUser } from 'src/typeorm/entities/AigaUser';
import { UpdateNoticeParams } from 'src/utils/types';
import { Repository,Like } from 'typeorm';
import { CreateNoticeDto } from "../../dtos/CreateNotice.dto"

@Injectable()
export class NoticesService {
  constructor(
    @InjectRepository(Notice, 'service')
    private readonly noticeRepository: Repository<Notice>
  ) {}

  findReviews() {
    return this.noticeRepository.find();
  }

  paginate( query:any) {
    const { page, take, orderName, order } = query;
    return this.noticeRepository.findAndCount({
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
    const noticesQuery = this.noticeRepository.createQueryBuilder('tb_notice')
      .select(["tb_notice.*, user.nickname, user.email"])
      .addSelect((qb) => {
        const subQuery = qb.select('COUNT(*) as totalCount').from(Notice, 'tr');
        return subQuery;
      }, "totalCount")
      .leftJoin(AigaUser, 'user', 'user.user_id = tb_notice.writer')
      .where('tb_notice.is_delete = :is_delete', { is_delete: false }) // Add this condition
      .orderBy(orderName, order)
      .offset(page == 1 ? page - 1 : (page - 1) * take)
      .limit(take);

    const notices = await noticesQuery.getRawMany();
    return notices;

   
  }


  findNoticesByNotice_id( notice_id : string) {
    return this.noticeRepository.find({
      where : {
        notice_id : notice_id,
        is_delete: false
      }
    });
  }

  findNoticesByKeyword( search_word : string) {
    return this.noticeRepository.find({
      where : {
        content : Like(`%${search_word}%`),
        is_delete: false
      }
    });
  }


  createNotice(noticeDetails: CreateNoticeDto) {
    const newNotice = this.noticeRepository.create({
      ...noticeDetails,
    });
    return this.noticeRepository.save(newNotice);
  }

  softDeleteNotices(ids: number[]) {
    const stringIds = ids.map(id => String(id)); // Convert number[] to string[]
    return this.noticeRepository.update(stringIds, { is_delete: true, updateAt: new Date() });
  }

  updateNotice(notice_id: string, updateNoticeDetails: UpdateNoticeParams) {
    return this.noticeRepository.update({ notice_id }, { ...updateNoticeDetails });
  }
}