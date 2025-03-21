import { Controller, ParseIntPipe, NotFoundException } from '@nestjs/common';
import { Body, Delete, Get, Param, Post, Put } from '@nestjs/common/decorators';
import { CreateHospitalDto } from 'src/hospital/dtos/CreateHospital.dto';
import { CreateUserPostDto } from 'src/users/dtos/CreateUserPost.dto';
import { CreateUserProfileDto } from 'src/users/dtos/CreateUserProfile.dto';
import { UpdateUserDto } from 'src/users/dtos/UpdateUser.dto';
import { HospitalsService } from 'src/hospital/services/hospitals/hospitals.service';
import { ApiTags } from '@nestjs/swagger';
@ApiTags("Hospital")

@Controller('hospitals')
export class HospitalsController {
  constructor(private hospitalervice: HospitalsService) {}

  @Get()
  async getHospitals() {
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

  @Put(':id')
  async updateUserById(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    await this.hospitalervice.updateUser({ ...updateUserDto, id });
  }

  @Get(':id')
  async getUserById(@Param('id', ParseIntPipe) id: number) {
    const user = await this.hospitalervice.getUser(id);
    return user;
  }

  @Delete(':id')
  async deleteUserById(@Param('id', ParseIntPipe) id: number) {
    await this.hospitalervice.deleteUser(id);
  }

  @Post(':id/profiles')
  createUserProfile(
    @Param('id', ParseIntPipe) id: number,
    @Body() createUserProfile: CreateUserProfileDto,
  ) {
    return this.hospitalervice.createUserProfile(id, createUserProfile);
  }

  @Post(':id/posts')
  createUserPost(
    @Param('id', ParseIntPipe) id: number,
    @Body() createUserPostDto: CreateUserPostDto,
  ) {
    return this.hospitalervice.createUserPost(id, createUserPostDto);
  }
}
