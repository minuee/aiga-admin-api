import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateHospitalDto {
  @ApiProperty()
  @IsNotEmpty()
  hid: string;

  @ApiProperty()
  @IsNotEmpty()
  baseName: string;
  
  @ApiProperty()
  @IsNotEmpty()
  shortName: string;

  @ApiProperty()
  @IsOptional()
  address: string;

  @ApiProperty()
  @IsOptional()
  lat: string;

  @ApiProperty()
  @IsOptional()
  lon: string;

  @ApiProperty()
  @IsOptional()
  telephone: string;
}