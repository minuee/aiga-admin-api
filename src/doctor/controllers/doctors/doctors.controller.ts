import { Controller, ParseIntPipe, NotFoundException } from '@nestjs/common';
import { Body, Put, Delete, Get, Param, Post, Query } from '@nestjs/common/decorators';
import { CreateDoctorDto } from 'src/doctor/dtos/CreateDoctor.dto';
import { UpdateDoctorBasicDto } from 'src/doctor/dtos/UpdateDoctorBasic.dto';
import { UpdateDoctorCareerDto } from 'src/doctor/dtos/UpdateDoctorCareer.dto';
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
      const doctors = await this.doctorservice.findDoctors();
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
      const papers = await this.doctorPapersService.findDoctorsByHid(doctorId);
      return papers;
    } catch (error) {
      console.log("error",error)
      throw new NotFoundException('Doctor not found');
    }
  }

  @Put('/basoc/:doctor_id')
  async updateBasicByDoctorid(
    @Param('doctor_id') doctor_id: string,
    @Body() updateDoctorBasicDto: UpdateDoctorBasicDto,
  ) {
    try {
      const result = await this.doctorservice.updateDoctorBasic(doctor_id, updateDoctorBasicDto);
      if (result.affected === 0) {
       // throw new NotFoundException(`Hospital with HID #${hid} not found.`);
        return {
          success: false,
          message: `Doctor Basic with doctor_id #${doctor_id} not found.`
        };
      }
      return {
        success: true,
        message: `Successfully updated Doctor Basic with doctor_id #${doctor_id}.`,
      };
    } catch (error) {
      // Let NestJS's global exception filter handle the error for a consistent response
      console.log("error",error) 
      return {
        success: false,
        message: 'Failed to update Doctor Basic.',
      };
    }
  }
  @Put('/career/:doctor_id')
  async updateCareerByDoctorid(
    @Param('doctor_id') doctor_id: string,
    @Body() updateDoctorCareerDto: UpdateDoctorCareerDto,
  ) {
    try {
      const result = await this.doctorservice.updateDoctorCareer(doctor_id, updateDoctorCareerDto);
      if (result.affected === 0) {
       // throw new NotFoundException(`Hospital with HID #${hid} not found.`);
        return {
          success: false,
          message: `Doctor Basic with doctor_id #${doctor_id} not found.`
        };
      }
      return {
        success: true,
        message: `Successfully updated Doctor Basic with doctor_id #${doctor_id}.`,
      };
    } catch (error) {
      // Let NestJS's global exception filter handle the error for a consistent response
      console.log("error",error) 
      return {
        success: false,
        message: 'Failed to update Doctor Basic.',
      };
    }
  }


  @Delete('/dodctor/paper/:paper_id')
  async deleteUserById(@Param('paper_id', ParseIntPipe) paper_id: string) {
    try {
      const result = await this.doctorPapersService.deleteDoctorPaper(paper_id);
      if (result.affected === 0) {
        // throw new NotFoundException(`Hospital with HID #${hid} not found.`);
         return {
           success: false,
           message: `Remvoe DoctorPaper with paper_id #${paper_id} not found.`
         };
       }
       return {
         success: true,
         message: `Successfully Remvoe DoctorPaper with paper_id #${paper_id}.`,
       };
     } catch (error) {
       // Let NestJS's global exception filter handle the error for a consistent response
       console.log("error",error) 
       return {
         success: false,
         message: 'Failed to Remvoe DoctorPaper.',
       };
     }
  }


  @Get('/search/:keyword')
  async findDoctorsByKeyword(
    @Param('keyword') keyword: string,
  ) {
    try {
      const doctors = await this.doctorservice.findDoctorsByKeyword(keyword);
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
      const newDoctor = this.doctorservice.createDoctor({ hid,...data });
      return { ...newDoctor};
    } catch (error) {
      console.log("error",error)
      throw new NotFoundException('Doctor not found');
    }
  }
}