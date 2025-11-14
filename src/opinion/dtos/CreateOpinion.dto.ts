import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateOpinionDto {
  @ApiProperty()
  @IsNotEmpty()
  opinion_id: string;

  @ApiProperty()
  @IsNotEmpty()
  user_id: string;
  
  @ApiProperty()
  @IsNotEmpty()
  doctor_id: string;
}