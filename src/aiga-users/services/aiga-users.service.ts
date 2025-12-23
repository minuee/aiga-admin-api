import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AigaUser } from 'src/typeorm/entities/AigaUser';
import { Chatting } from 'src/typeorm/entities/Chatting';
import { Repository } from 'typeorm';
import { CreateAigaUserDto } from '../dtos/CreateAigaUser.dto';
import { UpdateAigaUserDto } from '../dtos/UpdateAigaUser.dto';
import { PageDto, PageOptionsDto, PageMetaDto } from 'src/config/pagination';

@Injectable()
export class AigaUsersService {
  constructor(
    @InjectRepository(AigaUser, 'service')
    private readonly aigaUserRepository: Repository<AigaUser>,
    @InjectRepository(Chatting, 'service')
    private readonly chattingRepository: Repository<Chatting>,
  ) {}

  async findAigaUsers(
    pageOptionsDto: PageOptionsDto,
  ): Promise<any> { // 반환 타입을 any로 변경하여 컨트롤러에서 가공
    const queryBuilder = this.aigaUserRepository.createQueryBuilder('aigaUser');

    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

    const subQuery = this.chattingRepository
      .createQueryBuilder('chatting')
      .select('chatting.user_id', 'user_id')
      .addSelect('SUM(chatting.used_token)', 'total_token_usage')
      .where('chatting.createAt >= :twentyFourHoursAgo', {
        twentyFourHoursAgo,
      })
      .groupBy('chatting.user_id');

    queryBuilder
      .select('aigaUser.*')
      .addSelect('IFNULL(tokenUsage.total_token_usage, 0)', 'total_token_usage')
      .addSelect((qb) => { // hospitals.service.ts의 paginate2와 유사하게 totalCount를 서브쿼리로 가져옴
        const totalCountSubquery = qb.subQuery()
          .select('COUNT(*)')
          .from(AigaUser, 'user_total_count'); // AigaUser 엔티티를 사용하여 totalCount를 가져옴
        return totalCountSubquery;
      }, "totalCount")
      .leftJoin(
        `(${subQuery.getQuery()})`,
        'tokenUsage',
        'tokenUsage.user_id = aigaUser.user_id',
      )
      .setParameters(subQuery.getParameters());

    if (pageOptionsDto.orderName) {
      queryBuilder.orderBy(
        `aigaUser.${pageOptionsDto.orderName}`,
        pageOptionsDto.order,
      );
    } else {
      queryBuilder.orderBy('aigaUser.user_id', 'DESC');
    }

    if (pageOptionsDto.keyword) {
      queryBuilder.andWhere('aigaUser.nickname LIKE :search', {
        search: `%${pageOptionsDto.keyword}%`,
      });
    }
    
    // isAll 파라미터가 'true'가 아니거나, 없거나, 'false'일 경우에만 페이징 적용
    // pageOptionsDto.isAll의 타입이 boolean으로 보장되지 않을 수 있으므로 문자열 비교
    if (pageOptionsDto.isAll === undefined || pageOptionsDto.isAll === false ) {
      queryBuilder.offset(pageOptionsDto.skip).limit(pageOptionsDto.take);
    }

    const users = await queryBuilder.getRawMany();

    return users; // 컨트롤러에서 PageDto 구성
  }

  createAigaUser(aigaUserDetails: CreateAigaUserDto) {
    const newAigaUser = this.aigaUserRepository.create({
      ...aigaUserDetails,
      createdAt: new Date(),
      updatedAt: new Date(),
      regist_date: new Date(),
    });

    return this.aigaUserRepository.save(newAigaUser);
  }

  async updateAigaUser(
    user_id: number,
    updateAigaUserDetails: UpdateAigaUserDto,
  ) {
    const user = await this.getAigaUser(user_id);

    if (!user) {
      throw new HttpException('AigaUser not found', HttpStatus.NOT_FOUND);
    }

    return this.aigaUserRepository.update(
      { user_id },
      { ...updateAigaUserDetails, updatedAt: new Date() },
    );
  }

  getAigaUser(user_id: number) {
    return this.aigaUserRepository.findOneBy({ user_id });
  }

  async deleteAigaUser(user_id: number) {
    const user = await this.getAigaUser(user_id);

    if (!user) {
      throw new HttpException('AigaUser not found', HttpStatus.NOT_FOUND);
    }

    return this.aigaUserRepository.delete({ user_id });
  }
}