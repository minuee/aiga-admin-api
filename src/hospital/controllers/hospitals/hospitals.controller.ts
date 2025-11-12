import { Controller, ParseIntPipe, NotFoundException, Query,DefaultValuePipe } from '@nestjs/common';
import { Body, Delete, Get, Param, Post, Put } from '@nestjs/common/decorators';
import { CreateHospitalDto } from 'src/hospital/dtos/CreateHospital.dto';
import { UpdateHospitalDto } from 'src/hospital/dtos/UpdateHospital.dto';

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
  async getHospitals( @Query() pageOptionsDto: PageOptionsDto ): Promise<PageDto<CreateHospitalDto>> {
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
      const hospitals:any = await this.hospitalervice.paginate2(pageOptionsDto);
      if ( hospitals.length > 0 ) {
        retData = {
          data : hospitals,
          meta : {
            currentPage : pageOptionsDto.page,
            pageCount : pageOptionsDto.take,
            orderBy : pageOptionsDto.order,
            orderName : pageOptionsDto.orderName,
            isAll : pageOptionsDto.isAll,
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

  @Put(':hid')
  async updateHospitalByHid(
    @Param('hid') hid: string,
    @Body() updateHospitalDto: UpdateHospitalDto,
  ) {
    try {
      const result = await this.hospitalervice.updateHospital(hid, updateHospitalDto);
      if (result.affected === 0) {
       // throw new NotFoundException(`Hospital with HID #${hid} not found.`);
        return {
          success: false,
          message: `Hospital with HID #${hid} not found.`
        };
      }
      return {
        success: true,
        message: `Successfully updated hospital with HID #${hid}.`,
      };
    } catch (error) {
      // Let NestJS's global exception filter handle the error for a consistent response
      console.log("error",error) 
      return {
        success: false,
        message: 'Failed to update hospital.',
      };
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
      throw new NotFoundException('Data not found');
    }
  } */

  @Get('all')
  async getAllHospitals() {
    try {
      const hospitals = await this.hospitalervice.findHospitals();
      return hospitals;
    } catch (error) {
      //console.log("error",error)
      throw new NotFoundException('Data not found');
    }
  }
  
  @Get('/hid/:hid')
  async getHospitalsByHid(
    @Param('hid') id: string,
  ) {
    try {
      const hospitals = await this.hospitalervice.findHospitalsByHid(id);
      return hospitals;
    } catch (error) {
      //console.log("error",error)
      throw new NotFoundException('Data not found');
    }
  }
  
  @Get('/hid/search/:keyword')
  async findHospitalsByKeyword(
    @Param('keyword') keyword: string,
  ) {
    try {
      const hospitals = await this.hospitalervice.findHospitalsByKeyword(keyword);
      return hospitals;
    } catch (error) {
      //console.log("error",error)
      throw new NotFoundException('Data not found');
    }
  }
  @Post()
  createHospital(@Body() createHospitalDto: CreateHospitalDto) {
    try {
      const { hid,baseName,shortName} = createHospitalDto;
      const newHospital = this.hospitalervice.createHospital({ hid,baseName,shortName });
      return { ...newHospital};
    } catch (error) {
      throw new NotFoundException('Data not found');
    }
  }
}
