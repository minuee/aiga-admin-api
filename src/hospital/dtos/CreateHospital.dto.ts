import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateHospitalDto {
  @ApiProperty()
  @IsNotEmpty()
  hid: string;

  @ApiProperty()
  @IsNotEmpty()
  baseName: string;
  
  @ApiProperty()
  @IsNotEmpty()
  shortName: string;
}
