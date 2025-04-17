import { Controller, ParseIntPipe, NotFoundException, Query,DefaultValuePipe } from '@nestjs/common';
import { Body, Delete, Get, Param, Post, Put } from '@nestjs/common/decorators';
import { CreateHospitalDto } from 'src/hospital/dtos/CreateHospital.dto';
import { CreateUserPostDto } from 'src/users/dtos/CreateUserPost.dto';
import { CreateUserProfileDto } from 'src/users/dtos/CreateUserProfile.dto';
import { UpdateUserDto } from 'src/users/dtos/UpdateUser.dto';
import { HospitalsService } from 'src/hospital/services/hospitals/hospitals.service';
import { PageDto, PageOptionsDto } from "src/config/pagination";
import { ApiTags } from '@nestjs/swagger';
@ApiTags("Hospital")

@Controller('hospitals')
export class HospitalsController {
  constructor(private hospitalervice: HospitalsService) {}


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
  async getHospitals(
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<CreateHospitalDto>> {
    try {
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
      const hospitals:any = await this.hospitalervice.paginate2(pageOptionsDto);
      console.log("hospitals",hospitals)
      if ( hospitals.length > 0 ) {
        retData = {
          data : hospitals,
          meta : {
            currentPage : pageOptionsDto.page,
            pageCount : pageOptionsDto.take,
            orderBy : pageOptionsDto.order,
            orderName : pageOptionsDto.orderName,
            totalCount : parseInt(hospitals[0].totalCount)
          }
        }
        return retData;
      }
      
    } catch (error) {
      console.log("error",error)
      throw new NotFoundException('Hospital not found');
    }
  }
  /* 
  @Get()
  async getHospitals2(
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<CreateHospitalDto>> {
    try {
      let retData:any = {
        data : [],
        meta : {
          currentPage : 0,
          pageCount : 0,
          totalCount : 0,
          orderBy : 'ASC',
          orderName : 'null'
        }
      }
      const hospitals:any = await this.hospitalervice.paginate2(pageOptionsDto);
      console.log("hospitals",hospitals)
      if ( hospitals.length > 0 ) {
        retData = {
          data : hospitals[0],
          meta : {
            currentPage : pageOptionsDto.page,
            pageCount : pageOptionsDto.take,
            orderBy : pageOptionsDto.order,
            orderName : pageOptionsDto.orderName,
            totalCount : hospitals[1]
          }
        }
        return retData;
      }
      
    } catch (error) {
      console.log("error",error)
      throw new NotFoundException('Hospital not found');
    }
  } */

  @Get('all')
  async getAllHospitals() {
    try {
      console.log("getHospitals")
      const hospitals = await this.hospitalervice.findHospitals();
      console.log("hospitals",hospitals)
      return hospitals;
    } catch (error) {
      console.log("error",error)
      throw new NotFoundException('Team not found');
    }
  }
  
  @Get('/hid/:hid')
  async getHospitalsByHid(
    @Param('hid') id: string,
  ) {
    try {
      console.log("getHospitals", id)
      const hospitals = await this.hospitalervice.findHospitalsByHid(id);
      console.log("hospitals",hospitals)
      return hospitals;
    } catch (error) {
      console.log("error",error)
      throw new NotFoundException('Team not found');
    }
  }
  
  @Get('/hid/search/:keyword')
  async findHospitalsByKeyword(
    @Param('keyword') keyword: string,
  ) {
    try {
      console.log("getHospitals", keyword)
      const hospitals = await this.hospitalervice.findHospitalsByKeyword(keyword);
      console.log("hospitals",hospitals)
      return hospitals;
    } catch (error) {
      console.log("error",error)
      throw new NotFoundException('Team not found');
    }
  }
  @Post()
  createHospital(@Body() createHospitalDto: CreateHospitalDto) {
    try {
      const { hid,baseName,shortName} = createHospitalDto;
      console.log("createHospitalDto",createHospitalDto)
      const newHospital = this.hospitalervice.createHospital({ hid,baseName,shortName });
      return { ...newHospital};
    } catch (error) {
      console.log("error",error)
      throw new NotFoundException('Team not found');
    }
  }
}
