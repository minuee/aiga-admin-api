import { Controller, ParseIntPipe, NotFoundException, Query,DefaultValuePipe } from '@nestjs/common';
import { Body, Delete, Get, Param, Post, Put } from '@nestjs/common/decorators';
import { CreateReviewDto } from 'src/review/dtos/CreateReview.dto';
import { UpdateReviewDto } from 'src/review/dtos/UpdateReview.dto';

import { ReviewsService } from 'src/review/services/reviews/reviews.service';
import { PageDto, PageOptionsDto } from "src/config/pagination";
import { ApiTags } from '@nestjs/swagger';
@ApiTags("Reviews")

@Controller('reviews')
export class ReviewsController {
  constructor(private reviewservice: ReviewsService) {}


 /*  @Get()
  async paginate(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
    @Query('sort') sort = 'hid',
    @Query('orderBy') orderBy = 'ASC',
  ) {
    limit = limit > 100 ? 100 : limit;
    return this.hospitalervice.paginate({page,limit,sort,orderBy},
    );
  } */



  @Get()
  async getReviews( @Query() pageOptionsDto: PageOptionsDto ): Promise<PageDto<CreateReviewDto>> {
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
      const datas:any = await this.reviewservice.paginate2(pageOptionsDto);
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

  @Put(':review_id')
  async updateReviewByReviewid(
    @Param('review_id') review_id: string,
    @Body() updateReviewDto: UpdateReviewDto,
  ) {
    try {
      const result = await this.reviewservice.updateReview(review_id, updateReviewDto);
      if (result.affected === 0) {
       // throw new NotFoundException(`Hospital with HID #${hid} not found.`);
        return {
          success: false,
          message: `Review with HID #${review_id} not found.`
        };
      }
      return {
        success: true,
        message: `Successfully updated Review with HID #${review_id}.`,
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
  
  @Get('/:review_id')
  async getReviewsByReviewid(
    @Param('review_id') review_id: string,
  ) {
    try {
      const datas = await this.reviewservice.findReviewsByReview_id(review_id);
      return datas;
    } catch (error) {
      //console.log("error",error)
      throw new NotFoundException('Data not found');
    }
  }
  
  @Get('/search/:keyword')
  async findReviewsByKeyword(
    @Param('keyword') keyword: string,
  ) {
    try {
      const datas = await this.reviewservice.findReviewsByKeyword(keyword);
      return datas;
    } catch (error) {
      //console.log("error",error)
      throw new NotFoundException('Data not found');
    }
  }
  
}
