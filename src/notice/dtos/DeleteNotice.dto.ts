import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber } from 'class-validator';

export class DeleteNoticeDto {
  @ApiProperty({ description: 'Array of notice IDs to delete' })
  @IsArray()
  @IsNumber({}, { each: true }) // Changed to IsNumber
  @IsNotEmpty({ each: true })
  noticeIds: number[];
}
