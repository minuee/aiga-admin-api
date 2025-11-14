import { Controller, ParseIntPipe, NotFoundException, Query,DefaultValuePipe } from '@nestjs/common';
import { Body, Delete, Get, Param, Post, Put } from '@nestjs/common/decorators';
import { CreateOpinionDto } from 'src/opinion/dtos/CreateOpinion.dto';
import { UpdateOpinionDto } from 'src/opinion/dtos/UpdateOpinion.dto';

import { OpinionsService } from 'src/opinion/services/opinions/opinion.service';
import { PageDto, PageOptionsDto } from "src/config/pagination";
import { ApiTags } from '@nestjs/swagger';
@ApiTags("Opinions")

@Controller('opinions')
export class OpinionsController {
  constructor(private opinionservice: OpinionsService) {}


  @Get()
  async getOpinions( @Query() pageOptionsDto: PageOptionsDto ): Promise<PageDto<CreateOpinionDto>> {
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
      const datas:any = await this.opinionservice.paginate2(pageOptionsDto);
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

  @Put(':opinion_id')
  async updateOpinionByOpinionid(
    @Param('opinion_id') opinion_id: string,
    @Body() updateOpinionDto: UpdateOpinionDto,
  ) {
    try {
      const result = await this.opinionservice.updateOpinion(opinion_id, updateOpinionDto);
      if (result.affected === 0) {
       // throw new NotFoundException(`Hospital with HID #${hid} not found.`);
        return {
          success: false,
          message: `Opinion with  #${opinion_id} not found.`
        };
      }
      return {
        success: true,
        message: `Successfully updated Opinion with  #${opinion_id}.`,
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
  
  @Get('/:opinion_id')
  async getOpinionsByOpinionid(
    @Param('opinion_id') opinion_id: string,
  ) {
    try {
      const datas = await this.opinionservice.findOpinionsByOpinion_id(opinion_id);
      return datas;
    } catch (error) {
      //console.log("error",error)
      throw new NotFoundException('Data not found');
    }
  }
  
  @Get('/search/:keyword')
  async findOpinionsByKeyword(
    @Param('keyword') keyword: string,
  ) {
    try {
      const datas = await this.opinionservice.findOpinionsByKeyword(keyword);
      return datas;
    } catch (error) {
      //console.log("error",error)
      throw new NotFoundException('Data not found');
    }
  }
  
}
