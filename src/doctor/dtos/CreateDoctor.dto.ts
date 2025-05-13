import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateDoctorDto {
  @ApiProperty()
  @IsNotEmpty()
  rid: string;

  @ApiProperty()
  @IsNotEmpty()
  hid: string;

  @ApiProperty()
  @IsNotEmpty()
  data_version_id: string;

  @ApiProperty()
  @IsNotEmpty()
  depthname: string;

  @ApiProperty()
  @IsNotEmpty()
  doctrname: string;

  @ApiProperty()
  @IsNotEmpty()
  doctor_url: string;

  @ApiProperty()
  @IsOptional()
  doctor_id: string;
  
  @ApiProperty()
  @IsOptional()
  prev_id: string;

  @ApiProperty()
  @IsOptional()
  short_id: string;

  @ApiProperty()
  @IsOptional()
  specialties: string;

  @ApiProperty()
  @IsOptional()
  profileimgurl: string;

  @ApiProperty()
  @IsOptional()
  local_img: string;

  @ApiProperty()
  @IsOptional()
  standard_opt: string;

  @ApiProperty()
  @IsOptional()
  standard_spec: string;

}
