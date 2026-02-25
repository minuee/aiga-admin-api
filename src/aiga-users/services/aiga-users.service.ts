import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AigaUser } from 'src/typeorm/entities/AigaUser';
import { Chatting } from 'src/typeorm/entities/Chatting';
import { Repository } from 'typeorm';
import { CreateAigaUserDto } from '../dtos/CreateAigaUser.dto';
import { UpdateAigaUserDto } from '../dtos/UpdateAigaUser.dto';
import { PageDto, PageOptionsDto, PageMetaDto } from 'src/config/pagination';
import { TokenResetLog } from 'src/typeorm/entities/TokenResetLog';

@Injectable()
export class AigaUsersService {
  constructor(
    @InjectRepository(AigaUser, 'service')
    private readonly aigaUserRepository: Repository<AigaUser>,
    @InjectRepository(Chatting, 'service')
    private readonly chattingRepository: Repository<Chatting>,
    @InjectRepository(TokenResetLog, 'service')
    private readonly tokenResetLogRepository: Repository<TokenResetLog>,
  ) {}

  async resetRestriction(userId: string, adminId: string): Promise<{ success: boolean, message: string }> {
    const user = await this.getAigaUser(userId);
    if (!user) {
      throw new HttpException('AigaUser not found', HttpStatus.NOT_FOUND);
    }

    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

    // 1. tb_chatting 테이블에서 최근 24시간의 used_token 총합 조회
    const { sum } = await this.chattingRepository
      .createQueryBuilder('chatting')
      .select('SUM(chatting.grand_total_token)', 'sum')
      .where('chatting.user_id = :userId', { userId })
      .andWhere('chatting.createdAt >= :twentyFourHoursAgo', { twentyFourHoursAgo })
      .getRawOne();
    
    const resetSumToken = sum ? parseInt(sum, 10) : 0;

    // 2. tb_user 테이블의 restricted_time을 null로 업데이트
    await this.aigaUserRepository.update(
      { user_id: userId },
      { restricted_time: null },
    );

    // 3. tb_chatting 테이블의 최근 24시간 used_token을 0으로 업데이트
    await this.chattingRepository
      .createQueryBuilder()
      .update(Chatting)
      .set({ used_token: 0 })
      .where('user_id = :userId', { userId })
      .andWhere('createdAt >= :twentyFourHoursAgo', { twentyFourHoursAgo })
      .execute();

    // 4. 로그 기록
    const newLog = this.tokenResetLogRepository.create({
      userId: userId,
      adminUserId: adminId,
      resetSumToken: resetSumToken,
    });
    await this.tokenResetLogRepository.save(newLog);

    return { success: true, message: 'User restriction reset successfully.' };
  }

  async findAigaUsers(
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<AigaUser>> {
    const queryBuilder = this.aigaUserRepository.createQueryBuilder('aigaUser');

    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

    const subQuery = this.chattingRepository
      .createQueryBuilder('chatting')
      .select('chatting.user_id', 'user_id')
      .addSelect('SUM(chatting.used_token)', 'total_token_usage')
      .where('chatting.createdAt >= :twentyFourHoursAgo', {
        twentyFourHoursAgo,
      })
      .groupBy('chatting.user_id');

    queryBuilder
      .select('aigaUser.*')
      .addSelect('IFNULL(tokenUsage.total_token_usage, 0)', 'total_token_usage')
      .leftJoin(
        `(${subQuery.getQuery()})`,
        'tokenUsage',
        'tokenUsage.user_id = aigaUser.user_id',
      )
      .setParameters(subQuery.getParameters());

    if (pageOptionsDto.keyword) {
      queryBuilder.andWhere('aigaUser.nickname LIKE :search', {
        search: `%${pageOptionsDto.keyword}%`,
      });
    }

    // `COUNT` 쿼리를 위한 새로운 쿼리 빌더 생성 (LIMIT, OFFSET, ORDER BY 없이 WHERE 조건만 포함)
    const countQueryBuilder = this.aigaUserRepository.createQueryBuilder('aigaUser');
    if (pageOptionsDto.keyword) {
      countQueryBuilder.andWhere('aigaUser.nickname LIKE :search', {
        search: `%${pageOptionsDto.keyword}%`,
      });
    }
    const itemCount = await countQueryBuilder.getCount();

    if (pageOptionsDto.orderName) {
      queryBuilder.orderBy(
        `aigaUser.${pageOptionsDto.orderName}`,
        pageOptionsDto.order,
      );
    } else {
      queryBuilder.orderBy('aigaUser.user_id', 'DESC');
    }
    
    queryBuilder.offset(pageOptionsDto.skip).limit(pageOptionsDto.take);
    
    const users = await queryBuilder.getRawMany();

    const mappedUsers = users.map(user => {
      const aigaUser = new AigaUser();
      Object.assign(aigaUser, user);
      aigaUser.total_token_usage = parseInt(user.total_token_usage, 10); 
      return aigaUser;
    });

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(mappedUsers, pageMetaDto);
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
    user_id: string,
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

  getAigaUser(user_id: string) {
    return this.aigaUserRepository.findOneBy({ user_id });
  }

  async deleteAigaUser(user_id: string) {
    const user = await this.getAigaUser(user_id);

    if (!user) {
      throw new HttpException('AigaUser not found', HttpStatus.NOT_FOUND);
    }

    return this.aigaUserRepository.delete({ user_id });
  }
}