
import { Controller, Get, Delete, Query, UseGuards, Param, NotFoundException } from '@nestjs/common';
import { StatisticsService } from '../services/statistics.service';
import { ApiKeyGuard } from 'src/common/guards/api-key.guard';
import { PageOptionsDto } from 'src/config/pagination/page-options.dto';
import { GetAnalysisStatisticsDto } from '../dtos/GetAnalysisStatistics.dto';
import { PageDto } from 'src/config/pagination/page.dto';
import { Chatting } from '@entities/Chatting';

@UseGuards(ApiKeyGuard)
@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get('dashboard')
  getStatistics() {
    return this.statisticsService.getStatistics();
  }

  @Get('analysis')
  getAnalysisStatistics(@Query() query: GetAnalysisStatisticsDto) {
    return this.statisticsService.getAnalysisStatistics(query);
  }

  // tb_chatting session_id별 메시지 리스트 조회 
  @Get('message')
  async getMessageLists(
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<any>> {
    return this.statisticsService.getMessageLists(pageOptionsDto);
  }

   // tb_chatting session_id에 해당하는 상세 메시지 조회 
  @Get('message/:session_id')
  async getMessageDetailLists(@Param('session_id') session_id: string): Promise<Chatting[]> {
    return this.statisticsService.getMessageDetailLists(session_id);
  }

  @Delete('message/:session_id')
  async removeMessageDetailLists(@Param('session_id') session_id: string): Promise<{ success: boolean, message: string }> {
    
    try {
      const result = await this.statisticsService.removeMessageDetailLists(session_id);
      if (result.affected === 0) {
        return { success: false, message: `message with session_id #${session_id} not found.` };
      }
      return { success: true, message: `Successfully deleted message with session_id #${session_id}.` };
    } catch (error) {
      console.error("Error deleting messages:", error);
      throw new NotFoundException('Failed to delete messages.');
    }
  }

  @Get('standard-dept-spec')
  async getStandardDeptSpec() {
    return this.statisticsService.getStandardDeptSpec();
  }

  @Get('standard-specialty')
  async getStandardSpecialty() {
    return this.statisticsService.getStandardSpecialty();
  }

  @Get('standard-specialty-doctors/:dept_name')
  async getStandardDeptSpecForDoctors(@Param('dept_name') dept_name: string) {
    return this.statisticsService.getStandardDeptSpecForDoctor(dept_name);
  }

  @Get('data-version')
  async getDataHistory() {
    return this.statisticsService.getDataHistory();
  }
}
