import { Controller, ParseIntPipe, NotFoundException, Query,DefaultValuePipe } from '@nestjs/common';
import { Body, Delete, Get, Param, Post, Put } from '@nestjs/common/decorators';
import { CreateNoticeDto } from 'src/notice/dtos/CreateNotice.dto';
import { UpdateNoticeDto } from 'src/notice/dtos/UpdateNotice.dto';

import { NoticesService } from 'src/notice/services/notices/notice.service';
import { PageDto, PageOptionsDto } from "src/config/pagination";
import { ApiTags } from '@nestjs/swagger';
@ApiTags("Notices")

@Controller('notices')
export class NoticesController {
  constructor(private noticeservice: NoticesService) {}


  @Get()
  async getReviews( @Query() pageOptionsDto: PageOptionsDto ): Promise<PageDto<CreateNoticeDto>> {
    try {
      console.log("pageOptionsDto",pageOptionsDto)
      let retData:any = {
        data : [],
        meta : {
          currentPage : 0,
          pageCount : 0,
          totalCount : 0,
          isOrder : 'default',
          orderBy : 'ASC',
          orderName : 'null'
        }
      }
      const datas:any = await this.noticeservice.paginate2(pageOptionsDto);
      if ( datas.length > 0 ) {
        retData = {
          data : datas,
          meta : {
            currentPage : pageOptionsDto.page,
            pageCount : pageOptionsDto.take,
            orderBy : pageOptionsDto.order,
            orderName : pageOptionsDto.orderName,
            totalCount : parseInt(datas[0].totalCount)
          }
        }
        return retData;
      }
      
    } catch (error) {
      console.log("error",error)
      throw new NotFoundException('Review not found');
    }
  }

  @Put(':notice_id')
  async updateNoticeByNoticeid(
    @Param('notice_id') notice_id: string,
    @Body() updateNoticeDto: UpdateNoticeDto,
  ) {
    try {
      const result = await this.noticeservice.updateNotice(notice_id, updateNoticeDto);
      console.log("result",updateNoticeDto);
      if (result.affected === 0) {
       // throw new NotFoundException(`Hospital with HID #${hid} not found.`);
        return {
          success: false,
          message: `Opinion with  #${notice_id} not found.`
        };
      }
      return {
        success: true,
        message: `Successfully updated Opinion with  #${notice_id}.`,
      };
    } catch (error) {
      // Let NestJS's global exception filter handle the error for a consistent response
      console.log("error",error) 
      return {
        success: false,
        message: 'Failed to update Review.',
      };
    }
  }
  
  @Get('/:notice_id')
  async getNoticesByNoticeid(
    @Param('notice_id') notice_id: string,
  ) {
    try {
      const datas = await this.noticeservice.findNoticesByNotice_id(notice_id);
      return datas;
    } catch (error) {
      //console.log("error",error)
      throw new NotFoundException('Data not found');
    }
  }
  
  @Get('/search/:keyword')
  async findNoticesByKeyword(
    @Param('keyword') keyword: string,
  ) {
    try {
      const datas = await this.noticeservice.findNoticesByKeyword(keyword);
      return datas;
    } catch (error) {
      //console.log("error",error)
      throw new NotFoundException('Data not found');
    }
  }
  
}
