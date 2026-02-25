import { Controller, ParseIntPipe, NotFoundException } from '@nestjs/common';
import { Body, Put, Delete, Get, Param, Post, Query } from '@nestjs/common/decorators';
import { CreateDoctorDto } from 'src/doctor/dtos/CreateDoctor.dto';
import { UpdateDoctorBasicDto } from 'src/doctor/dtos/UpdateDoctorBasic.dto';
import { UpdateDoctorCareerDto } from 'src/doctor/dtos/UpdateDoctorCareer.dto';
import { DoctorsService } from 'src/doctor/services/doctors/doctors.service';
import { DoctorPapersService } from 'src/doctor/services/doctors/doctor_papers.service';
import { DoctorEvaluationDto } from 'src/doctor/dtos/DoctorEvaluation.dto'; // DoctorEvaluationDto import
import { UpdateDoctorEvaluationDto } from 'src/doctor/dtos/UpdateDoctorEvaluation.dto';
import { ApiTags } from '@nestjs/swagger';
import { PageDto, PageOptionsDto } from "src/config/pagination";
import { DoctorSpecialtyDto } from 'src/doctor/dtos/DoctorSpecialty.dto';

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

  @Get('/evaluation/:doctorId')
  async findDoctorEvaluation(
    @Param('doctorId', ParseIntPipe) doctorId: number, // doctorId를 ParseIntPipe로 변환
  ): Promise<DoctorEvaluationDto[]> {
    try {
      const evaluations = await this.doctorservice.findDoctorEvaluationByDoctorId(doctorId); // doctorservice 호출
      if (!evaluations || evaluations.length === 0) {
        return []; // 데이터가 없을 경우 빈 배열 반환
      }
      return evaluations;
    } catch (error) {
      console.error("Error fetching doctor evaluations:", error);
      return []; // 에러 발생 시 빈 배열 반환
    }
  }

  @Put('/evaluation/:doctorEvalId')
  async updateDoctorEvaluation(
    @Param('doctorEvalId', ParseIntPipe) doctorEvalId: number,
    @Body() updateDoctorEvaluationDto: UpdateDoctorEvaluationDto,
  ) {
    try {
      const result = await this.doctorservice.updateDoctorEvaluationByEvalId(doctorEvalId, updateDoctorEvaluationDto);
      if (result.affected === 0) {
        return {
          success: false,
          message: `Doctor Evaluation with ID #${doctorEvalId} not found.`
        };
      }
      return {
        success: true,
        message: `Successfully updated Doctor Evaluation with ID #${doctorEvalId}.`,
      };
    } catch (error) {
      console.error("Error update for doctor evaluations:", error);
      return {
        success: false,
        message: 'Failed to update Doctor Evaluation.',
      };
    }
  }

  @Delete('/evaluation/:doctorEvalId')
  async deleteDoctorEvaluation(@Param('doctorEvalId', ParseIntPipe) doctorEvalId: number) {
    try {
      const result = await this.doctorservice.deleteDoctorEvaluationByEvalId(doctorEvalId);
      if (result.affected === 0) {
         return {
           success: false,
           message: `Remove DoctorEvaluation with doctor_evaluation_id #${doctorEvalId} not found.`
         };
       }
       return {
         success: true,
         message: `Successfully Remove DoctorEvaluation with doctor_evaluation_id #${doctorEvalId}.`,
       };
     } catch (error) {
       console.log("error",error) 
       return {
         success: false,
         message: 'Failed to Remove DoctorEvaluation.',
       };
     }
  }

  @Get('/specialty/:doctorId')
  async findDoctorSpecialty(
    @Param('doctorId', ParseIntPipe) doctorId: number, // doctorId를 ParseIntPipe로 변환
  ): Promise<DoctorSpecialtyDto[]> {
    try {
      const specialtys = await this.doctorservice.findDoctorSpecialtyByDoctorId(doctorId); // doctorservice 호출
      if (!specialtys || specialtys.length === 0) {
        return []; // 데이터가 없을 경우 빈 배열 반환
      }
      return specialtys;
    } catch (error) {
      console.error("Error fetching doctor specialtys:", error);
      return []; // 에러 발생 시 빈 배열 반환
    }
  }


  @Put('/basic/:doctor_id')
  async updateBasicByDoctorid(
    @Param('doctor_id') rid_long: string,
    @Body() updateDoctorBasicDto: UpdateDoctorBasicDto,
  ) {
    try {
      const result = await this.doctorservice.updateDoctorBasic(rid_long, updateDoctorBasicDto);
      if (result?.affected === 0) {
       // throw new NotFoundException(`Hospital with HID #${hid} not found.`);
        return {
          success: false,
          message: `Doctor Basic with doctor_id #${rid_long} not found.`
        };
      }
      return {
        success: true,
        message: `Successfully updated Doctor Basic with doctor_id #${rid_long}.`,
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
  @Put('/career/:doctor_rid')
  async updateCareerByDoctorid(
    @Param('doctor_rid') rid_long: string,
    @Body() updateDoctorCareerDto: UpdateDoctorCareerDto,
  ) {
    try {
      const result = await this.doctorservice.updateDoctorCareer(rid_long, updateDoctorCareerDto);
      if (result.affected === 0) {
       // throw new NotFoundException(`Hospital with HID #${hid} not found.`);
        return {
          success: false,
          message: `Doctor Basic with rid_long #${rid_long} not found.`
        };
      }
      return {
        success: true,
        message: `Successfully updated Doctor Basic with rid_long #${rid_long}.`,
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

  @Get('/:doctor_id')
  async getDoctorById(
    @Param('doctor_id') doctorId: string,
  ): Promise<CreateDoctorDto> {
    try {
      const doctor = await this.doctorservice.findDoctorById(doctorId);
      if (!doctor) {
        throw new NotFoundException(`Doctor with ID ${doctorId} not found`);
      }
      // Doctor 엔티티를 CreateDoctorDto로 매핑
      const doctorDto: CreateDoctorDto = {
        rid: doctor.rid_long,
        hid: doctor.hid,
        data_version_id: doctor.data_version_id,
        depthname: doctor.deptname,
        doctrname: doctor.doctorname,
        doctor_url: doctor.doctor_url,
        doctor_id: doctor.doctor_id,
        prev_id: doctor.prev_rid,
        short_id: doctor.short_rid,
        specialties: doctor.specialties,
        profileimgurl: doctor.profileimgurl,
        local_img: doctor.local_img,
        standard_opt: doctor.standard_opt,
        standard_spec: doctor.standard_spec,
        jsondata: doctor.jsondata, // 추가된 필드 매핑
        prev_hospitalName: doctor.prev_hospitalName, // 추가된 필드 매핑
      };
      return doctorDto;
    } catch (error) {
      console.error("Error fetching doctor by ID:", error);
      throw new NotFoundException(`Doctor with ID ${doctorId} not found`);
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
