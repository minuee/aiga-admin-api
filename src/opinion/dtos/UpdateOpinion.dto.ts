import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateOpinionDto {
  @ApiProperty()
  @IsNotEmpty()
  opinion_id: number;

  @ApiProperty()
  @IsNotEmpty()
  user_id: string;

  @ApiProperty()
  @IsOptional()
  opinion_type: string;

  @ApiProperty()
  @IsNotEmpty()
  doctor_id: string;

  @ApiProperty()
  @IsOptional()
  title: string;

  @ApiProperty()
  @IsOptional()
  content: string;

  @ApiProperty()
  @IsOptional()
  memo: string;

  @ApiProperty()
  @IsOptional()
  is_clear: string;
}