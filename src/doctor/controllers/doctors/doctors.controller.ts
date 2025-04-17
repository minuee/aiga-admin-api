import { Controller, ParseIntPipe, NotFoundException } from '@nestjs/common';
import { Body, Delete, Get, Param, Post, Put } from '@nestjs/common/decorators';
import { CreateDoctorDto } from 'src/doctor/dtos/CreateDoctor.dto';
import { DoctorsService } from 'src/doctor/services/doctors/doctors.service';
import { ApiTags } from '@nestjs/swagger';
@ApiTags("Doctor")

@Controller('doctors')
export class DoctorsController {
  constructor(private doctorservice: DoctorsService) {}

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
  async getDoctorsByHid(
    @Param('hid') id: string,
  ) {
    try {
      console.log("getDoctorsByHid", id)
      const doctors = await this.doctorservice.findDoctorsByHid(id);
      console.log("doctors",doctors)
      return doctors;
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
