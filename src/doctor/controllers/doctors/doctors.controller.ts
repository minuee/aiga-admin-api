import { Controller, ParseIntPipe, NotFoundException } from '@nestjs/common';
import { Body, Delete, Get, Param, Post, Query } from '@nestjs/common/decorators';
import { CreateDoctorDto } from 'src/doctor/dtos/CreateDoctor.dto';
import { DoctorsService } from 'src/doctor/services/doctors/doctors.service';
import { DoctorPapersService } from 'src/doctor/services/doctors/doctor_papers.service';
import { ApiTags } from '@nestjs/swagger';
import { PageDto, PageOptionsDto } from "src/config/pagination";

@ApiTags("Doctor")

@Controller('doctors')
export class DoctorsController {
  constructor(
    private doctorservice: DoctorsService,
    private doctorPapersService: DoctorPapersService // 추가된 서비스
  ) {}

  @Get()
  async getDoctors() {
    try {
      console.log("getDoctors")
      const doctors = await this.doctorservice.findDoctors();
      console.log("doctors",doctors)
      return doctors;
    } catch (error) {
      console.log("error",error)
      throw new NotFoundException('Doctor not found');
    }
  }

  @Get('/hid/:hid')
  async getPageDoctorss(
    @Param('hid') hid: string,
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<CreateDoctorDto>> {
    console.log("hid",hid)
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
      const doctors:any = await this.doctorservice.paginate(hid,pageOptionsDto);
      //console.log("doctors",doctors)
      if ( doctors.length > 0 ) {
        retData = {
          data : doctors,
          meta : {
            currentPage : pageOptionsDto.page,
            pageCount : pageOptionsDto.take,
            orderBy : pageOptionsDto.order,
            orderName : pageOptionsDto.orderName,
            totalCount : parseInt(doctors[0].totalCount)
          }
        }
        return retData;
      }
      
    } catch (error) {
      console.log("error",error)
      throw new NotFoundException('Doctors not found');
    }
  }

  @Get('/paper/:doctorId')
  async findDoctorPaper(
    @Param('doctorId') doctorId: string,
  ) {
    try {
      console.log("findDoctorsByKeyword", doctorId)
      const papers = await this.doctorPapersService.findDoctorsByHid(doctorId);
      console.log("papers",papers)
      return papers;
    } catch (error) {
      console.log("error",error)
      throw new NotFoundException('Doctor not found');
    }
  }
  
  
  @Get('/search/:keyword')
  async findDoctorsByKeyword(
    @Param('keyword') keyword: string,
  ) {
    try {
      console.log("findDoctorsByKeyword", keyword)
      const doctors = await this.doctorservice.findDoctorsByKeyword(keyword);
      console.log("doctors",doctors)
      return doctors;
    } catch (error) {
      console.log("error",error)
      throw new NotFoundException('Doctor not found');
    }
  }
  @Post()
  createHospital(@Body() createDoctorDto: CreateDoctorDto) {
    try {
      const { hid,...data} = createDoctorDto;
      console.log("createHospitalDto",createDoctorDto)
      const newDoctor = this.doctorservice.createDoctor({ hid,...data });
      return { ...newDoctor};
    } catch (error) {
      console.log("error",error)
      throw new NotFoundException('Doctor not found');
    }
  }
}
