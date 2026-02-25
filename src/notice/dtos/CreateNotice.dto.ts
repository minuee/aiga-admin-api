import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsBoolean, IsString } from 'class-validator';

export class CreateNoticeDto {
  @ApiProperty({ description: 'The ID of the notice (optional for creation)' })
  @IsOptional()
  @IsString()
  notice_id?: string;

  @ApiProperty({ description: 'The title of the notice' })
  @IsNotEmpty()
  @IsString()
  title: string;
  
  @ApiProperty({ description: 'The content of the notice' })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty({ description: 'Whether the notice is active' })
  @IsNotEmpty()
  @IsBoolean() // Changed from IsString to IsBoolean
  is_active: boolean;

  @ApiProperty({ description: 'The opening date of the notice (YYYY-MM-DD)' })
  @IsNotEmpty()
  @IsString() // Using string as per example payload
  open_date: string;

  @ApiProperty({ description: 'The writer of the notice' })
  @IsNotEmpty()
  @IsString()
  writer: string;
}