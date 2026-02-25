import { Controller, ParseIntPipe, NotFoundException, Query,DefaultValuePipe } from '@nestjs/common';
import { Body, Delete, Get, Param, Post, Put } from '@nestjs/common/decorators';
import { CreateHospitalDto } from 'src/hospital/dtos/CreateHospital.dto';
import { UpdateHospitalDto } from 'src/hospital/dtos/UpdateHospital.dto';
import { CreateHospitalAliasDto } from 'src/hospital/dtos/CreateHospitalAlias.dto';
import { UpdateHospitalAliasDto } from 'src/hospital/dtos/UpdateHospitalAlias.dto';
import { HospitalEvaluationDto } from 'src/hospital/dtos/HospitalEvaluation.dto'; // HospitalEvaluationDto import

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


  @Get('alias/:hid')
  async getHospitalsAliasByHid(
    @Param('hid') id: string,
  ) {
    try {
      const hospitalAliass = await this.hospitalervice.findHospitalsAliasByHid(id);
      return hospitalAliass;
    } catch (error) {
      console.error("Error fetching hospital alias:", error); // 에러 로깅 추가
      return []; // 데이터가 없을 경우 빈 배열을 반환
    }
  }

  @Get('evaluation/:hid')
  async getHospitalEvaluationByHid(
    @Param('hid') id: string,
  ): Promise<HospitalEvaluationDto[]> {
    try {
      const evaluations = await this.hospitalervice.findHospitalEvaluationByHid(id);
      if (!evaluations || evaluations.length === 0) {
        return []; // 데이터가 없을 경우 빈 배열 반환
      }
      return evaluations;
    } catch (error) {
      console.error("Error fetching hospital evaluations:", error);
      return []; // 에러 발생 시 빈 배열 반환
    }
  }
  
  @Post('alias')
  async createHospitalAlias(@Body() createHospitalAliasDto: CreateHospitalAliasDto) {
    try {
      const newHospitalAlias = await this.hospitalervice.createHospitalAlias(createHospitalAliasDto);
      return { success: true, message: 'Hospital alias created successfully.', data: newHospitalAlias };
    } catch (error) {
      console.error("Error creating hospital alias:", error);
      throw new NotFoundException('Failed to create hospital alias.');
    }
  }
  

  @Put('alias')
  async updateHospitalAlias(@Body() updateHospitalAliasDto: UpdateHospitalAliasDto) {
    try {
      const result = await this.hospitalervice.updateHospitalAlias(updateHospitalAliasDto.aid, updateHospitalAliasDto);
      if (result.affected === 0) {
        return { success: false, message: `Hospital alias with AID #${updateHospitalAliasDto.aid} not found.` };
      }
      return { success: true, message: `Successfully updated hospital alias with AID #${updateHospitalAliasDto.aid}.` };
    } catch (error) {
      console.error("Error updating hospital alias:", error);
      throw new NotFoundException('Failed to update hospital alias.');
    }
  }

  @Delete('alias/:aid')
  async deleteHospitalAlias(@Param('aid', ParseIntPipe) aid: number) {
    try {
      const result = await this.hospitalervice.deleteHospitalAlias(aid);
      if (result.affected === 0) {
        return { success: false, message: `Hospital alias with AID #${aid} not found.` };
      }
      return { success: true, message: `Successfully deleted hospital alias with AID #${aid}.` };
    } catch (error) {
      console.error("Error deleting hospital alias:", error);
      throw new NotFoundException('Failed to delete hospital alias.');
    }
  }

  @Put(':hid')
  async updateHospitalByHid(
    @Param('hid') hid: string,
    @Body() updateHospitalDto: UpdateHospitalDto,
  ) {
    try {
      console.log(`Updating hospital with HID: ${hid}, received DTO:`, updateHospitalDto);

      // updateHospitalDto가 비어있는지 명시적으로 확인 (ValidationPipe가 작동하지 않을 경우 대비)
      // UpdateHospitalDto에 hid, baseName, shortName이 @IsNotEmpty()로 정의되어 있으므로,
      // ValidationPipe가 정상 작동한다면 이 검사는 사실상 불필요하지만,
      // 예상치 못한 상황에 대비한 방어 코드입니다.
      const hasUpdateFields = Object.keys(updateHospitalDto).some(key => key !== 'hid');
      if (!hasUpdateFields) {
        return {
          success: false,
          message: `No update fields provided for hospital with HID #${hid}.`
        };
      }

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
      console.error("Error updating hospital:", error); 
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
