
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, DeleteResult, IsNull, Not, Repository } from 'typeorm';
import { AigaUser } from '@entities/AigaUser';
import { Chatting } from '@entities/Chatting';
import { ChatSearchLog } from '@entities/ChatSearchLog';
import { ChatSearchProposal } from '@entities/ChatSearchProposal';
import { Doctor } from '@entities/Doctor';
import { Hospital } from '@entities/Hospital';
import { PageOptionsDto, SearchType } from 'src/config/pagination/page-options.dto';
import { PageDto } from 'src/config/pagination/page.dto';
import { PageMetaDto } from 'src/config/pagination/page-meta.dto';
import { GetAnalysisStatisticsDto } from '../dtos/GetAnalysisStatistics.dto';
import { StandardDeptSpec } from '@entities/StandardDeptSpec';
import { StandardSpecialty } from '@entities/StandardSpecialty';
import { DataHistory } from '@entities/DataHistory';
import { DoctorEvaluation } from '@entities/DoctorEvaluation';

interface ChattingSession {
  user_id: string;
  nickname: string;
  session_id: string;
  usedTokenSum: number;
  chatCount: number;
  lastUsedAt: Date;
}

@Injectable()
export class StatisticsService {
  constructor(
    @InjectRepository(AigaUser, 'service')
    private readonly aigaUserRepository: Repository<AigaUser>,
    @InjectRepository(Chatting, 'service')
    private readonly chattingRepository: Repository<Chatting>,
    @InjectRepository(ChatSearchLog, 'service')
    private readonly chatSearchLogRepository: Repository<ChatSearchLog>,
    @InjectRepository(ChatSearchProposal, 'service')
    private readonly chatSearchProposalRepository: Repository<ChatSearchProposal>,
    @InjectRepository(Doctor, 'default')
    private readonly doctorRepository: Repository<Doctor>,
    @InjectRepository(Hospital, 'default')
    private readonly hospitalRepository: Repository<Hospital>,
    @InjectRepository(StandardDeptSpec, 'default')
    private readonly standardDeptSpecRepository: Repository<StandardDeptSpec>,
    @InjectRepository(StandardSpecialty, 'default')
    private readonly standardSpecialtyRepository: Repository<StandardSpecialty>,
    @InjectRepository(DataHistory, 'default')
    private readonly dataHistoryRepository: Repository<DataHistory>,
    @InjectRepository(DoctorEvaluation, 'default') // 추가
    private readonly doctorEvaluationRepository: Repository<DoctorEvaluation>,
  ) {}

  async getAnalysisStatistics(query: GetAnalysisStatisticsDto) {
    const { searchType } = query;
    switch (searchType) {
      case 'doctor':
        return this.getDoctorStatistics(query);
      case 'hospital':
        return this.getHospitalStatistics(query);
      case 'keyword':
        return this.getKeywordStatistics(query);
      case 'token':
        return this.getTokenStatistics(query);
      default:
        return []; // 혹은 에러 처리
    }
  }

  async getDoctorStatistics(query: GetAnalysisStatisticsDto) {
    let { start_date, end_date, limit, keyword: searchKeyword } = query;

    if (!start_date || !end_date) {
      const ed = new Date();
      const sd = new Date();
      sd.setDate(ed.getDate() - 7);
      end_date = ed.toISOString().slice(0, 10);
      start_date = sd.toISOString().slice(0, 10);
    }

    const qb = this.chatSearchProposalRepository.createQueryBuilder('proposal'); // Main query from ChatSearchProposal

    qb.innerJoin('proposal.log', 'log') // Join to ChatSearchLog
      .innerJoin(
        'view_standardspecialty', // Join to the view
        'spec',
        'spec.standard_spec = proposal.keyword COLLATE utf8mb4_0900_ai_ci', // Collation handled here
      )
      .select([
        'spec.standard_group as standard_group',
        'proposal.keyword as standard_spec', // Disease from ChatSearchProposal
        'log.infoDid as did',
        'log.infoName as info_name',
        'log.infoHospitalName as info_hospital_name',
        'log.infoDeptname as info_deptname',
        'log.infoHid as info_hid',
      ])
      .addSelect('COUNT(*)', 'search_count')
      .where('log.chatType = :chatType', { chatType: 'DOCTOR' })
      .andWhere('log.createdAt BETWEEN :start AND :end', {
        start: `${start_date} 00:00:00`,
        end: `${end_date} 23:59:59`,
      });

    if (searchKeyword) {
      qb.andWhere('proposal.keyword LIKE :searchKeyword', { // Keyword search on proposal.keyword
        searchKeyword: `%${searchKeyword}%`,
      });
    }

    qb.groupBy(
      'spec.standard_group, proposal.keyword, log.infoDid, log.infoName, log.infoHospitalName, log.infoDeptname, log.infoHid',
    );
    qb.orderBy('standard_group', 'ASC');
    qb.addOrderBy('standard_spec', 'ASC');
    qb.addOrderBy('search_count', 'DESC');

    const results = await qb.getRawMany();

    const groupedResults = results.reduce((acc, current) => {
      const {
        standard_group,
        standard_spec,
        did,
        info_name,
        info_hospital_name,
        info_deptname,
        info_hid,
        search_count,
      } = current;

      let group = acc.find((g) => g.standard_group === standard_group);
      if (!group) {
        group = {
          standard_group: standard_group,
          specs: [],
        };
        acc.push(group);
      }

      let spec = group.specs.find((s) => s.standard_spec === standard_spec);
      if (!spec) {
        spec = {
          standard_spec: standard_spec,
          doctors: [],
        };
        group.specs.push(spec);
      }

      if (!limit || (limit && spec.doctors.length < limit)) {
        spec.doctors.push({
          info_did: did,
          info_name,
          info_hospital_name,
          info_deptname,
          info_hid,
          search_count: parseInt(search_count, 10),
        });
      }

      return acc;
    }, []);

    const finalResult = groupedResults;

    return finalResult;
  }

  async getHospitalStatistics(query: GetAnalysisStatisticsDto) {
    let { start_date, end_date, limit, keyword: searchKeyword } = query;

    if (!start_date || !end_date) {
      const ed = new Date();
      const sd = new Date();
      sd.setDate(ed.getDate() - 7);
      end_date = ed.toISOString().slice(0, 10);
      start_date = sd.toISOString().slice(0, 10);
    }

    const qb = this.chatSearchLogRepository.createQueryBuilder('log');

    qb.select(['log.infoHid as hid', 'log.infoName as name'])
      .addSelect('COUNT(log.infoHid)', 'count')
      .where('log.chatType = :chatType', { chatType: 'HOSPITAL' })
      .andWhere('log.createdAt BETWEEN :start AND :end', {
        start: `${start_date} 00:00:00`,
        end: `${end_date} 23:59:59`,
      });

    if (searchKeyword) {
      qb.andWhere('log.infoName LIKE :searchKeyword', {
        searchKeyword: `%${searchKeyword}%`,
      });
    }

    qb.groupBy('log.infoHid, log.infoName').orderBy('count', 'DESC');

    if (limit) {
      qb.limit(limit);
    }

    return qb.getRawMany();
  }

  async getKeywordStatistics(query: GetAnalysisStatisticsDto) {
    let { start_date, end_date, limit, keyword: searchKeyword } = query;

    if (!start_date || !end_date) {
      const ed = new Date();
      const sd = new Date();
      sd.setDate(ed.getDate() - 7);
      end_date = ed.toISOString().slice(0, 10);
      start_date = sd.toISOString().slice(0, 10);
    }

    const qb = this.chatSearchProposalRepository.createQueryBuilder('proposal');

    qb.innerJoin('proposal.log', 'log')
      .select('proposal.keyword', 'keyword')
      .addSelect('COUNT(DISTINCT proposal.groupId)', 'count') // CHANGED HERE
      .where('log.createdAt BETWEEN :start AND :end', {
        start: `${start_date} 00:00:00`,
        end: `${end_date} 23:59:59`,
      });

    if (searchKeyword) {
      qb.andWhere('proposal.keyword LIKE :searchKeyword', {
        searchKeyword: `%${searchKeyword}%`,
      });
    }

    qb.groupBy('proposal.keyword').orderBy('count', 'DESC');

    if (limit) {
      qb.limit(limit);
    }

    return qb.getRawMany();
  }

    async getTokenStatistics(query: GetAnalysisStatisticsDto) {
      let { start_date, end_date } = query;
  
      // Set default date range if not provided
      if (!start_date || !end_date) {
        const ed = new Date();
        const sd = new Date();
        sd.setDate(ed.getDate() - 7);
        end_date = ed.toISOString().slice(0, 10);
        start_date = sd.toISOString().slice(0, 10);
      }
  
      const endDateObj = new Date(end_date);
      endDateObj.setHours(23, 59, 59, 999); // End of the day
  
      // --- 1. 기간 내 누적 토큰 사용량 (Cumulative for period) ---
      const cumulativeTokenUsageResult = await this.chattingRepository
        .createQueryBuilder('chatting')
        .select('SUM(chatting.used_token)', 'sum')
        .where('chatting.createdAt BETWEEN :start AND :end', {
          start: start_date,
          end: endDateObj,
        })
        .getRawOne();
      const cumulativeTokenUsage =
        parseInt(cumulativeTokenUsageResult.sum, 10) || 0;
  
      // --- 2. 일일 토큰 사용량 (Daily - last 42h from end_date) ---
      const dailyStartDate = new Date(endDateObj);
      dailyStartDate.setHours(dailyStartDate.getHours() - 42);
      const dailyTokenUsageResult = await this.chattingRepository
        .createQueryBuilder('chatting')
        .select('SUM(chatting.used_token)', 'sum')
        .where('chatting.createdAt BETWEEN :start AND :end', {
          start: dailyStartDate,
          end: endDateObj,
        })
        .getRawOne();
      const dailyTokenUsage = parseInt(dailyTokenUsageResult.sum, 10) || 0;
  
      // --- 3. 시간별 토큰 사용량 (Hourly - last 10h from end_date) ---
      const hourlyStartDate = new Date(endDateObj);
      hourlyStartDate.setHours(hourlyStartDate.getHours() - 10);
      const hourlyTokenUsageResult = await this.chattingRepository
        .createQueryBuilder('chatting')
        .select('SUM(chatting.used_token)', 'sum')
        .where('chatting.createdAt BETWEEN :start AND :end', {
          start: hourlyStartDate,
          end: endDateObj,
        })
        .getRawOne();
      const hourlyTokenUsage = parseInt(hourlyTokenUsageResult.sum, 10) || 0;
  
      // --- 4. 전체 기간 토큰 사용량 (All Time) ---
      const totalTokenUsageAllResult = await this.chattingRepository
        .createQueryBuilder('chatting')
        .select('SUM(chatting.used_token)', 'sum')
        .getRawOne();
      const totalTokenUsageAllTime =
        parseInt(totalTokenUsageAllResult.sum, 10) || 0;
  
      // --- 5. 일별 토큰 사용 추이 (Daily Trend) ---
      const dailyTrend = await this.chattingRepository
        .createQueryBuilder('chatting')
        .select("DATE_FORMAT(chatting.createdAt, '%Y-%m-%d')", 'date')
        .addSelect('SUM(chatting.used_token)', 'total')
        .where('chatting.createdAt BETWEEN :start AND :end', {
          start: start_date,
          end: endDateObj,
        })
        .groupBy('date')
        .orderBy('date', 'DESC')
        .getRawMany();
  
      return {
        dailyTokenUsage,
        hourlyTokenUsage,
        cumulativeTokenUsage,
        totalTokenUsageAllTime,
        dailyTrend,
      };
    }

  async getMessageLists(
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<ChattingSession>> {
    // --- COUNT QUERY ---
    let countQueryBuilder = this.chattingRepository
      .createQueryBuilder('chatting')
      .leftJoin(AigaUser, 'aigaUser', 'chatting.user_id = aigaUser.user_id');

    if (pageOptionsDto.keyword && pageOptionsDto.searchType !== SearchType.EMPTY) {
      let searchField: string;
      switch (pageOptionsDto.searchType) {
        case SearchType.NICKNAME:
          searchField = 'aigaUser.nickname';
          break;
        case SearchType.SESSION_ID:
          searchField = 'chatting.session_id';
          break;
        case SearchType.QUESTION:
          searchField = 'chatting.question';
          break;
        default:
          searchField = 'aigaUser.nickname';
          break;
      }
      countQueryBuilder.andWhere(`${searchField} Like :keyword`, { keyword: `%${pageOptionsDto.keyword}%` });
    }
    
    // Important: subquery to count the groups correctly
    const subQuery = countQueryBuilder.select('chatting.session_id').groupBy('chatting.session_id');
    const countResult = await this.chattingRepository.manager.connection
      .createQueryBuilder()
      .select('COUNT(*)', 'count')
      .from(`(${subQuery.getQuery()})`, 'subquery')
      .setParameters(subQuery.getParameters())
      .getRawOne();
      
    const itemCount = countResult ? parseInt(countResult.count, 10) : 0;

    // --- DATA QUERY ---
    let dataQueryBuilder = this.chattingRepository
      .createQueryBuilder('chatting')
      .leftJoin(AigaUser, 'aigaUser', 'chatting.user_id = aigaUser.user_id')
      .select('chatting.user_id', 'user_id')
      .addSelect('aigaUser.nickname', 'nickname')
      .addSelect('chatting.session_id', 'session_id')
      .addSelect('SUM(chatting.used_token)', 'usedTokenSum')
      .addSelect('COUNT(chatting.chat_id)', 'chatCount')
      .addSelect('DATE_ADD(MAX(chatting.createdAt), INTERVAL 9 HOUR)', 'lastUsedAt')
      .groupBy('chatting.session_id')
      .addGroupBy('chatting.user_id')
      .addGroupBy('aigaUser.nickname');

    if (pageOptionsDto.keyword && pageOptionsDto.searchType !== SearchType.EMPTY) {
      let searchField: string;
      switch (pageOptionsDto.searchType) {
        case SearchType.NICKNAME:
          searchField = 'aigaUser.nickname';
          break;
        case SearchType.SESSION_ID:
          searchField = 'chatting.session_id';
          break;
        case SearchType.QUESTION:
          searchField = 'chatting.question';
          break;
        default:
          searchField = 'aigaUser.nickname';
          break;
      }
      dataQueryBuilder.andWhere(`${searchField} Like :keyword`, { keyword: `%${pageOptionsDto.keyword}%` });
    }
    
    dataQueryBuilder
      .orderBy('lastUsedAt', pageOptionsDto.order)
      .offset(pageOptionsDto.skip)
      .limit(pageOptionsDto.take);

    const raw = await dataQueryBuilder.getRawMany();
    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(raw as ChattingSession[], pageMetaDto);
  }

  async getMessageDetailLists(session_id: string): Promise<Chatting[]> {
    return this.chattingRepository
      .createQueryBuilder('chatting')
      .select([
        'chatting.chat_id',
        'chatting.chat_type',
        'chatting.question',
        'chatting.answer',
        'chatting.used_token',
        'chatting.summary',
      ])
      .where('chatting.session_id = :session_id', { session_id })
      .orderBy('chatting.chat_id', 'ASC')
      .getMany();
  }

  async removeMessageDetailLists(session_id: string): Promise<DeleteResult> {
    return this.chattingRepository.delete({ session_id });
  }

  // StandardDeptSpec 전체 데이터 조회 메서드 추가
  async getStandardDeptSpec(): Promise<StandardDeptSpec[]> {
    return this.standardDeptSpecRepository.find({
      select: ['dept_spec_id', 'standard_dept', 'standard_spec'],
      order: {
        dept_spec_id: 'ASC', // dept_spec_id를 기준으로 오름차순 정렬
      },
    });
  }

  // StandardSpecialty 전체 데이터 조회 메서드 추가
  async getStandardSpecialty(): Promise<StandardSpecialty[]> {
    return this.standardSpecialtyRepository.find({
      select: ['spec_id','standard_spec','standard_group'],
    });
  }

  // DataHistory 전체 데이터 조회 메서드 추가
  async getDataHistory(): Promise<DataHistory[]> {
    return this.dataHistoryRepository.find({
      select: ['data_version_id', 'title', 'collect_start', 'collect_end'],
    });
  }

  // standard-dept-spec-doctors 엔드포인트용 서비스 메서드
  async getStandardDeptSpecForDoctor(dept_name: string): Promise<any[]> {
    // 1. standardspecialty 테이블에서 dept_name에 해당하는 standard_spec 조회
    const standardSpecialty = await this.standardSpecialtyRepository
      .createQueryBuilder('ss')
      .select('ss.standard_spec')
      .where('ss.standard_spec = :dept_name', { dept_name })
      .getOne();

    if (!standardSpecialty) {
      return []; // 해당 dept_name에 맞는 standard_spec이 없으면 빈 배열 반환
    }

    const targetSpec = standardSpecialty.standard_spec;

    // 2. doctor_evaluation 테이블에서 해당 standard_spec을 가진 의사 찾기
    //    doctor 테이블과 조인하여 필요한 정보 가져오기
    //    hospital 테이블과 조인하여 shortName 가져오기
    const doctors = await this.doctorEvaluationRepository
      .createQueryBuilder('de')
      .innerJoin('doctor_basic', 'd', 'de.doctor_id = d.doctor_id') // 'doctor' 대신 'doctor_basic'으로 테이블명 명시
      .leftJoin('hospital', 'h', 'd.hid = h.hid')
      .select([
        'de.doctor_id',
      ])
      .addSelect('d.rid_long', 'rid_long')
      .addSelect('d.profileimgurl', 'profileimgurl')
      .addSelect('d.deptname', 'deptname')
      .addSelect('d.doctorname', 'doctorname')
      .addSelect('d.createAt', 'createAt')
      .addSelect('d.updateAt', 'updateAt')
      .addSelect('d.specialties', 'specialties')
      .addSelect('d.doctor_url', 'doctor_url')
      .addSelect('h.shortName', 'shortName')
      .addSelect('h.hid', 'hid')
      .where('de.standardSpec = :targetSpec', { targetSpec })
      .getRawMany();

    return doctors;
  }

  async getStatistics() {
    const totalUsers = await this.getTotalUsers();
    const recentUsers = await this.getRecentUsers();
    const withdrawnUsers = await this.getWithdrawnUsers();
    const dailyTokenUsage = await this.getDailyTokenUsage();
    const hourlyTokenUsage = await this.getHourlyTokenUsage();
    const totalTokenUsage = await this.getTotalTokenUsage();
    const doctorRanking = await this.getDoctorRanking();
    const hospitalRanking = await this.getHospitalRanking();
    const keywordRanking = await this.getKeywordRanking();
    const dailyTokenUsageSummary = await this.getDailyTokenUsageSummary(); // New
    const monthlyTokenUsageSummary = await this.getMonthlyTokenUsageSummary(); // New

    return {
      totalUsers,
      recentUsers,
      withdrawnUsers,
      dailyTokenUsage,
      hourlyTokenUsage,
      totalTokenUsage,
      doctorRanking,
      hospitalRanking,
      keywordRanking,
      dailyTokenUsageSummary, // New
      monthlyTokenUsageSummary, // New
    };
  }

  private async getDailyTokenUsageSummary(): Promise<{ date: string; tokens: number }[]> {
    const today = new Date();
    const dateList: string[] = [];
    for (let i = 6; i >= 0; i--) { // 최근 7일
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      dateList.push(d.toISOString().split('T')[0]); // YYYY-MM-DD
    }

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const result = await this.chattingRepository
      .createQueryBuilder('chatting')
      .select("DATE_FORMAT(chatting.createdAt, '%Y-%m-%d')", 'date')
      .addSelect('SUM(chatting.used_token)', 'tokens')
      .where('chatting.createdAt >= :date', { date: sevenDaysAgo })
      .groupBy('date')
      .orderBy('date', 'ASC')
      .getRawMany();

    const dataMap = new Map<string, number>();
    result.forEach(item => {
      dataMap.set(item.date, parseInt(item.tokens, 10) || 0);
    });

    return dateList.map(date => ({
      date,
      tokens: dataMap.get(date) || 0,
    }));
  }

  private async getMonthlyTokenUsageSummary(): Promise<{ date: string; tokens: number }[]> {
    const today = new Date();
    const monthList: string[] = [];
    for (let i = 5; i >= 0; i--) { // 최근 6개월
      const d = new Date(today);
      d.setMonth(today.getMonth() - i);
      monthList.push(d.toISOString().substring(0, 7)); // YYYY-MM
    }

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    sixMonthsAgo.setDate(1); // Set to the first day of the month

    const result = await this.chattingRepository
      .createQueryBuilder('chatting')
      .select("DATE_FORMAT(chatting.createdAt, '%Y-%m')", 'date')
      .addSelect('SUM(chatting.used_token)', 'tokens')
      .where('chatting.createdAt >= :date', { date: sixMonthsAgo })
      .groupBy('date')
      .orderBy('date', 'ASC')
      .getRawMany();

    const dataMap = new Map<string, number>();
    result.forEach(item => {
      dataMap.set(item.date, parseInt(item.tokens, 10) || 0);
    });

    return monthList.map(month => ({
      date: month,
      tokens: dataMap.get(month) || 0,
    }));
  }

  private async getTotalUsers(): Promise<number> {
    return this.aigaUserRepository.count({
      where: { agreement: '1', unregist_date: IsNull() },
    });
  }

  private async getRecentUsers(): Promise<number> {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return this.aigaUserRepository.count({
      where: {
        agreement: '1',
        unregist_date: IsNull(),
        createdAt: Between(sevenDaysAgo, new Date()),
      },
    });
  }

  private async getWithdrawnUsers(): Promise<number> {
    return this.aigaUserRepository.count({
      where: { agreement: '1', unregist_date: Not(IsNull()) },
    });
  }

  private async getDailyTokenUsage(): Promise<number> {
    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 42);
    const result = await this.chattingRepository
      .createQueryBuilder('chatting')
      .select('SUM(chatting.used_token)', 'sum')
      .where('chatting.createdAt >= :date', { date: twentyFourHoursAgo })
      .getRawOne();
    return parseInt(result.sum, 10) || 0;
  }

  private async getHourlyTokenUsage(): Promise<number> {
    const oneHourAgo = new Date();
    oneHourAgo.setHours(oneHourAgo.getHours() - 10);
    console.log(`[Hourly Token Usage] Current time: ${new Date().toISOString()}`);
    console.log(`[Hourly Token Usage] One hour ago: ${oneHourAgo.toISOString()}`);
    const result = await this.chattingRepository
      .createQueryBuilder('chatting')
      .select('SUM(chatting.used_token)', 'sum')
      .where('chatting.createdAt >= :date', { date: oneHourAgo })
      .getRawOne();
    console.log(`[Hourly Token Usage] Query result:`, result);
    return parseInt(result.sum, 10) || 0;
  }

  private async getTotalTokenUsage(): Promise<number> {
    const result = await this.chattingRepository
      .createQueryBuilder('chatting')
      .select('SUM(chatting.used_token)', 'sum')
      .getRawOne();
    return parseInt(result.sum, 10) || 0;
  }

  private async getDoctorRanking() {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 30);
    return this.chatSearchLogRepository
      .createQueryBuilder('log')
      .select('log.info_did', 'did')
      .addSelect('log.info_name', 'name')
      .addSelect('log.info_hospital_name', 'hospitalName')
      .addSelect('log.info_deptname', 'deptName')
      .addSelect('COUNT(log.info_did)', 'count')
      .where('log.chatType = :type', { type: 'DOCTOR' })
      .andWhere('log.createdAt >= :date', { date: sevenDaysAgo })
      .groupBy('log.info_did, log.info_name, log.info_hospital_name, log.info_deptname')
      .orderBy('count', 'DESC')
      .addOrderBy('log.info_name', 'ASC')
      .limit(100)
      .getRawMany();
  }

  private async getHospitalRanking() {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 30);
    return this.chatSearchLogRepository
      .createQueryBuilder('log')
      .select('log.info_hid', 'hid')
      .addSelect('log.info_name', 'name')
      .addSelect('COUNT(log.info_hid)', 'count')
      .where('log.chatType = :type', { type: 'HOSPITAL' })
      .andWhere('log.createdAt >= :date', { date: sevenDaysAgo })
      .groupBy('log.info_hid, log.info_name')
      .orderBy('count', 'DESC')
      .addOrderBy('log.info_name', 'ASC')
      .limit(100)
      .getRawMany();
  }

  private async getKeywordRanking() {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 30);

    return this.chatSearchProposalRepository
      .createQueryBuilder('proposal')
      .select('proposal.keyword', 'keyword')
      .addSelect('COUNT(proposal.keyword)', 'count')
      .innerJoin('proposal.log', 'log')
      .where('log.createdAt >= :date', { date: sevenDaysAgo })
      .groupBy('proposal.keyword')
      .orderBy('count', 'DESC')
      .addOrderBy('proposal.keyword', 'ASC')
      .limit(100)
      .getRawMany();
  }
}
