import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateNoticeDto {
  @ApiProperty()
  @IsNotEmpty()
  notice_id: number;

  @ApiProperty()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsOptional()
  content: string;

  @ApiProperty()
  @IsNotEmpty()
  is_active: string;

  @ApiProperty()
  @IsOptional()
  open_date: string;

  @ApiProperty()
  @IsOptional()
  writer: string;
}